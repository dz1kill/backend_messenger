import { JwtPayload } from "jsonwebtoken";
import sequelize from "../models";
import { Message } from "../models/message";
import {
  ParramAddUserInGroup,
  ParramLastMessagesDialog,
  ParramLastMessagesGroup,
  ParramListLastMessage,
  ParramNewGroup,
  ReqMessageDTO,
} from "./types";
import { UserGroup } from "../models/group_user";
import { Group } from "../models/group";
import WebSocket from "ws";

const checkUserGroup = async (userId: number, groupId: number) => {
  const result = await sequelize.query(
    `  
  SELECT * FROM users_groups
  WHERE user_id = ${userId} AND group_id = ${groupId}`,
    { raw: true, nest: true, model: UserGroup }
  );
  if (result.length === 0) {
    throw { message: "User is not a member of this group" };
  }
};

export const listLastMessage = async (
  parseMessage: ReqMessageDTO<ParramListLastMessage>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page } = parseMessage.params;
  const offset = (page - 1) * limit;
  const result = await sequelize.query(
    `
   WITH numbered_messages AS (
      SELECT id, sender_id, receiver_id, group_id, content, created_at, updated_at , deleted_at,
             ROW_NUMBER() OVER(PARTITION BY sender_id, receiver_id, group_id ORDER BY created_at DESC) AS r_number
      FROM messages
      WHERE sender_id = ${id} OR receiver_id = ${id} OR group_id IN (
        SELECT group_id
        FROM users_groups
        WHERE user_id = ${id}
      )
    )
    SELECT id, sender_id as "senderId", receiver_id as "receiverId", group_id as "groupId", content,
     created_at as "createdAt", updated_at as "updatedAt" , deleted_at as "deletedAt"
    FROM numbered_messages
    WHERE r_number = 1
    ORDER BY created_at DESC
    LIMIT ${limit} 
    OFFSET ${offset}`,
    { raw: true, nest: true, model: Message }
  );
  return { messages: result };
};

export const latestMessageDialog = async (
  parseMessage: ReqMessageDTO<ParramLastMessagesDialog>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page, receiverId } = parseMessage.params;
  const offset = (page - 1) * limit;
  const result = await sequelize.query(
    `
    SELECT sender_id, receiver_id, messages.created_at , content, images.name, images.url
    FROM messages
    INNER JOIN images
    ON messages.id = images.message_id
    WHERE sender_id = ${id} AND receiver_id = ${receiverId}
         OR sender_id = ${receiverId} AND receiver_id = ${id}  
    LIMIT ${limit} 
    OFFSET ${offset}`,
    { raw: true, nest: true, model: Message }
  );
  return { messages: result };
};

export const latestMessageGroup = async (
  parsedMessage: ReqMessageDTO<ParramLastMessagesGroup>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page, groupId } = parsedMessage.params;
  const offset = (page - 1) * limit;
  await checkUserGroup(id, groupId);
  const result = await sequelize.query(
    `
    SELECT sender_id, group_id, messages.created_at , content, images.name, images.url
    FROM messages
    INNER JOIN images
    ON messages.id = images.message_id
    WHERE group_id = ${groupId}
    LIMIT ${limit}
    OFFSET ${offset}   
`,
    { raw: true, nest: true, model: Message }
  );
  return { messages: result };
};

export const newGroup = async (
  parsedMessage: ReqMessageDTO<ParramNewGroup>,
  client: JwtPayload
) => {
  const { id } = client;
  const { groupName } = parsedMessage.params;

  await sequelize.transaction(async (t) => {
    const group = await sequelize.query(
      `
  INSERT INTO groups (name, created_at, updated_at, deleted_at )
  VALUES ('${groupName}',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
  RETURNING id;
  `,
      { raw: true, nest: true, model: Group, transaction: t }
    );
    const groupId = group[0].id;
    await sequelize.query(
      `
  INSERT INTO users_groups (group_id, user_id)
  VALUES (${groupId}, ${id})
  `,
      { transaction: t }
    );
  });

  return { messages: "Group created" };
};

export const addUserInGroup = async (
  parsedMessage: ReqMessageDTO<ParramAddUserInGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id } = client;
  const { groupId, userId } = parsedMessage.params;
  await checkUserGroup(id, groupId);
  const usersInGroup = await sequelize.transaction(async (t) => {
    await sequelize.query(
      `
     INSERT INTO users_groups (group_id, user_id)
     VALUES (${groupId}, ${userId})
    `,
      { transaction: t }
    );
    return await sequelize.query(
      `
    SELECT user_id as "userId"
    FROM users_groups
    WHERE group_id = ${groupId}
    `,
      { nest: true, raw: true, transaction: t, model: UserGroup }
    );
  });

  usersInGroup.forEach((userInGroup) => {
    userConnections.forEach((ws, user) => {
      if (userInGroup.userId === user.id && user.id !== id) {
        ws.send(
          JSON.stringify({
            messages: `User #${userId} added in group`,
          })
        );
      }
    });
  });

  return { messages: `User #${userId} added in group` };
};
