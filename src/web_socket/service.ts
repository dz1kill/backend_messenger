import { JwtPayload } from "jsonwebtoken";
import sequelize from "../models";
import { Message } from "../models/message";
import {
  ParramAddUserInGroup,
  ParramLastMessagesDialog,
  ParramLastMessagesGroup,
  ParramLeaveGroup,
  ParramListLastMessage,
  ParramMessageGroup,
  ParramNewGroup,
  ParramPrivateMessage,
  ParramsResultSuccessResponse,
  ReqMessageDTO,
} from "./types";
import { UserGroup } from "../models/group_user";
import { Group } from "../models/group";
import WebSocket from "ws";
import {
  buildSuccessResponse,
  calcOffset,
  transformArrUserGroup,
} from "./helper";
import { Transaction } from "sequelize";
import {
  ADD_USER_IN_GROUP,
  LEAVE_GROUP,
  MESSAGE_IN_GROUP,
  PRIVATE_MESSAGE,
} from "./constants";

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

const insertGroup = async (groupName: string, trx: Transaction) =>
  await sequelize.query(
    `
INSERT INTO groups (name, created_at, updated_at, deleted_at )
VALUES ('${groupName}',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
RETURNING id;
`,
    { raw: true, nest: true, model: Group, transaction: trx }
  );

const insertUserGroup = async (
  groupId: number,
  userId: number,
  trx: Transaction
) =>
  await sequelize.query(
    `
  INSERT INTO users_groups (group_id, user_id)
  VALUES (${groupId}, ${userId})
 `,
    { model: UserGroup, transaction: trx }
  );

const selectUsersGroup = async (groupId: number) =>
  await sequelize.query(
    `
  SELECT user_id as "userId"
  FROM users_groups
  WHERE group_id = ${groupId}
  `,
    { nest: true, raw: true, model: UserGroup }
  );

const sendingMessages = (
  recipientIds: number[],
  userConnections: Map<JwtPayload, WebSocket>,
  senderId: number,
  data: ParramsResultSuccessResponse,
  scope: string
) => {
  recipientIds.forEach((userInGroup) => {
    userConnections.forEach((ws, user) => {
      if (userInGroup === user.id && user.id !== senderId) {
        buildSuccessResponse(ws, data, scope);
      }
    });
  });
};

const getDblatestMessageDialog = async (
  senderId: number,
  receiverId: number,
  limit: number,
  offset: number
) =>
  await sequelize.query(
    `
  SELECT sender_id, receiver_id, messages.created_at , content, images.name, images.url
  FROM messages
  INNER JOIN images
  ON messages.id = images.message_id
  WHERE sender_id = ${senderId} AND receiver_id = ${receiverId}
       OR sender_id = ${receiverId} AND receiver_id = ${senderId}  
  LIMIT ${limit} 
  OFFSET ${offset}`,
    { raw: true, nest: true, model: Message }
  );

const getDblistLastMessage = async (
  userId: number,
  limit: number,
  offset: number
) =>
  await sequelize.query(
    `
 WITH numbered_messages AS (
    SELECT id, sender_id, receiver_id, group_id, content, created_at, updated_at , deleted_at,
           ROW_NUMBER() OVER(PARTITION BY sender_id, receiver_id, group_id ORDER BY created_at DESC) AS r_number
    FROM messages
    WHERE sender_id = ${userId} OR receiver_id = ${userId} OR group_id IN (
      SELECT group_id
      FROM users_groups
      WHERE user_id = ${userId}
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

const getDblatestMessageGroup = async (
  groupId: number,
  limit: number,
  offset: number
) =>
  await sequelize.query(
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

const dropUserGroup = async (userId: number, groupId: number) => {
  await sequelize.query(
    `
    DELETE FROM users_groups
    WHERE group_id = ${groupId} AND user_id = ${userId}`,
    { model: UserGroup }
  );
};

const insertMessageGroup = async (
  senderId: number,
  groupId: number,
  content: string
) => {
  await sequelize.query(
    `
  
  INSERT INTO messages (sender_id, receiver_id, group_id, content,  created_at, updated_at, deleted_at )
  VALUES (${senderId}, NULL, ${groupId}, '${content}' ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )

  `,
    { model: Message }
  );
};

const insertPrivateMessage = async (
  senderId: number,
  receiverId: number,
  content: string
) => {
  await sequelize.query(
    `
  
  INSERT INTO messages (sender_id, receiver_id, group_id, content,  created_at, updated_at, deleted_at )
  VALUES (${senderId}, ${receiverId}, NULL, '${content}' ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )

  `,
    { model: Message }
  );
};

export const listLastMessage = async (
  parseMessage: ReqMessageDTO<ParramListLastMessage>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page } = parseMessage.params;

  const offset = calcOffset(page, limit);
  const result = await getDblistLastMessage(id, limit, offset);

  return { data: result };
};

export const latestMessageDialog = async (
  parseMessage: ReqMessageDTO<ParramLastMessagesDialog>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page, receiverId } = parseMessage.params;
  const offset = calcOffset(page, limit);
  const result = await getDblatestMessageDialog(id, receiverId, limit, offset);

  return { data: result };
};

export const latestMessageGroup = async (
  parsedMessage: ReqMessageDTO<ParramLastMessagesGroup>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, page, groupId } = parsedMessage.params;

  const offset = calcOffset(page, limit);
  await checkUserGroup(id, groupId);
  const result = await getDblatestMessageGroup(groupId, limit, offset);

  return { data: result };
};

export const newGroup = async (
  parsedMessage: ReqMessageDTO<ParramNewGroup>,
  client: JwtPayload
) => {
  const { id } = client;
  const { groupName } = parsedMessage.params;

  await sequelize.transaction(async (trx) => {
    const group = await insertGroup(groupName, trx);
    const groupId = group[0].id;
    await insertUserGroup(groupId, id, trx);
  });

  return {};
};

export const addUserInGroup = async (
  parsedMessage: ReqMessageDTO<ParramAddUserInGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, email, firstName } = client;
  const { groupId, userId } = parsedMessage.params;
  const data: ParramsResultSuccessResponse = {
    message: `User #${email} added in group.`,
    senderName: firstName,
  };

  await checkUserGroup(id, groupId);
  await sequelize.transaction(async (trx) => {
    await insertUserGroup(groupId, userId, trx);
  });

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: number[] = transformArrUserGroup(usersInGroup);

  sendingMessages(userIds, userConnections, id, data, ADD_USER_IN_GROUP);

  return {};
};

export const leaveGroup = async (
  parsedMessage: ReqMessageDTO<ParramLeaveGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, email, firstName } = client;
  const { groupId } = parsedMessage.params;
  const data: ParramsResultSuccessResponse = {
    message: `User ${email} has left the group.`,
    senderName: firstName,
  };

  await checkUserGroup(id, groupId);
  await dropUserGroup(id, groupId);

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: number[] = transformArrUserGroup(usersInGroup);

  sendingMessages(userIds, userConnections, id, data, LEAVE_GROUP);

  return {};
};

export const sendMessageGroup = async (
  parsedMessage: ReqMessageDTO<ParramMessageGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, firstName } = client;
  const { groupId, content } = parsedMessage.params;
  const data: ParramsResultSuccessResponse = {
    message: content,
    senderName: firstName,
  };

  await checkUserGroup(id, groupId);
  insertMessageGroup(id, groupId, content);

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: number[] = transformArrUserGroup(usersInGroup);

  sendingMessages(userIds, userConnections, id, data, MESSAGE_IN_GROUP);

  return {};
};

export const sendPrivateMessage = async (
  parsedMessage: ReqMessageDTO<ParramPrivateMessage>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, firstName } = client;
  const { receiverId, content } = parsedMessage.params;
  const receiverIdArr = [receiverId];
  const data: ParramsResultSuccessResponse = {
    message: content,
    senderName: firstName,
  };

  await insertPrivateMessage(id, receiverId, content);
  sendingMessages(receiverIdArr, userConnections, id, data, PRIVATE_MESSAGE);

  return {};
};
