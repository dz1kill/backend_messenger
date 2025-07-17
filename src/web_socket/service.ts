import { JwtPayload } from "jsonwebtoken";
import sequelize from "../models";
import {
  ParramAddUserInGroup,
  ParramDropGroup,
  ParramLastMessagesDialog,
  ParramLastMessagesGroup,
  ParramLeaveGroup,
  ParramListLastMessage,
  ParramMessageGroup,
  ParramPrivateMessage,
  ParramsResultSuccessResponse,
  ReqMessageDTO,
  ResDatalatestMessageDialog,
  ResDataLatestMessageGroup,
  ResDataListLastMessage,
} from "./types";
import { UserGroup } from "../models/group_user";
import WebSocket from "ws";
import { buildSuccessResponse, transformArrUserGroup } from "./helper";
import { QueryTypes, Transaction } from "sequelize";
import {
  ADD_USER_IN_GROUP,
  DROP_GROUP,
  LEAVE_GROUP,
  MESSAGE_IN_GROUP,
  PRIVATE_MESSAGE,
} from "./constants";

const checkUserGroup = async (userId: string, groupId: string) => {
  const result = await sequelize.query(
    `  
  SELECT * FROM users_groups
  WHERE user_id = '${userId}' AND group_id = '${groupId}'`,
    { raw: true, nest: true, model: UserGroup }
  );

  if (result.length === 0) {
    throw { message: "User is not a member of this group" };
  }
};

const insertUserGroup = async (
  groupId: string,
  userId: string,
  trx: Transaction
) =>
  await sequelize.query(
    `
  INSERT INTO users_groups (group_id, user_id)
  VALUES ('${groupId}', '${userId}')
 `,
    { model: UserGroup, transaction: trx }
  );

const selectUsersGroup = async (groupId: string) =>
  await sequelize.query(
    `
  SELECT user_id as "userId"
  FROM users_groups
  WHERE group_id = '${groupId}'
  `,
    { nest: true, raw: true, model: UserGroup }
  );

const sendingMessages = (
  recipientIds: string[],
  userConnections: Map<JwtPayload, WebSocket>,
  senderId: string,
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
  senderId: string,
  receiverId: string,
  limit: number,
  cursorCreatedAt: string
) =>
  await sequelize.query<ResDatalatestMessageDialog>(
    `SELECT
   messages.id AS "messageId",
   sender_id AS "senderId",
   sender.first_name AS "senderName",
   receiver_id AS "receiverId",
   receiver.first_name AS "receiverName",
   content,
   messages.created_at AS "createdAt"
FROM messages
LEFT JOIN users AS sender ON sender.id = messages.sender_id
LEFT JOIN users AS receiver ON receiver.id = messages.receiver_id
WHERE (sender_id = '${senderId}' AND receiver_id = '${receiverId}'
    OR sender_id = '${receiverId}' AND receiver_id = '${senderId}')
      AND (
    messages.deleted_by_users IS NULL 
    OR NOT messages.deleted_by_users @> ARRAY['${senderId}'::uuid]
  )
${
  cursorCreatedAt
    ? `AND messages.created_at < TIMESTAMP '${cursorCreatedAt}'`
    : ""
}
ORDER BY messages.created_at DESC
LIMIT ${limit}
  `,
    { raw: true, nest: true, type: QueryTypes.SELECT }
  );

const getDblistLastMessage = async (
  userId: string,
  limit: number,
  cursorCreatedAt: string | null
) =>
  await sequelize.query<ResDataListLastMessage>(
    `WITH user_conversations AS (
  SELECT 
    CASE 
      WHEN group_id IS NOT NULL THEN 'group_' || group_id
      WHEN sender_id < receiver_id THEN 'private_' || sender_id || '_' || receiver_id
      ELSE 'private_' || receiver_id || '_' || sender_id
    END AS conversation_id,
    MAX(messages.created_at) AS last_message_time
  FROM messages
  WHERE
      (
      (group_id IS NULL AND (
        sender_id = '${userId}' OR receiver_id = '${userId}'
      ) AND (
        deleted_by_users IS NULL 
        OR NOT deleted_by_users @> ARRAY['${userId}'::uuid]
      ))
      OR (
        group_id IS NOT NULL
        AND group_id IN (
          SELECT group_id FROM users_groups WHERE user_id = '${userId}'
        )
      )
    )

  GROUP BY conversation_id
  ${
    cursorCreatedAt
      ? `HAVING MAX(messages.created_at) < '${cursorCreatedAt}'`
      : ""
  }
  ORDER BY last_message_time DESC
  LIMIT ${limit}
),
last_messages AS (
  SELECT 
    m.id, 
    m.sender_id, 
    m.receiver_id, 
    m.group_id, 
    m.content, 
    m.created_at, 
    m.updated_at, 
    m.deleted_at,
    g.name AS "groupName", 
    u.first_name AS "senderName",
    u.last_name AS "senderLastName",
    r.last_name AS "receiverLastName",
    r.first_name AS "receiverName",
    CASE 
      WHEN m.group_id IS NOT NULL THEN 'group_' || m.group_id
      WHEN m.sender_id < m.receiver_id THEN 'private_' || m.sender_id || '_' || m.receiver_id
      ELSE 'private_' || m.receiver_id || '_' || m.sender_id
    END AS conversation_id
  FROM messages m
  JOIN user_conversations uc ON 
    CASE 
      WHEN m.group_id IS NOT NULL THEN 'group_' || m.group_id
      WHEN m.sender_id < m.receiver_id THEN 'private_' || m.sender_id || '_' || m.receiver_id
      ELSE 'private_' || m.receiver_id || '_' || m.sender_id
    END = uc.conversation_id
    AND m.created_at = uc.last_message_time
  LEFT JOIN groups g ON m.group_id = g.id
  LEFT JOIN users u ON m.sender_id = u.id
  LEFT JOIN users r ON m.receiver_id = r.id
)

SELECT 
  id as "messageId", 
  sender_id AS "senderId", 
  "senderName", 
  "senderLastName",
  receiver_id AS "receiverId", 
  "receiverName", 
  "receiverLastName",
  group_id AS "groupId", 
  "groupName", 
  content,
  created_at AS "createdAt", 
  updated_at AS "updatedAt", 
  deleted_at AS "deletedAt"
FROM last_messages
ORDER BY "createdAt" DESC;`,
    { raw: true, nest: true, type: QueryTypes.SELECT }
  );

const getDblatestMessageGroup = async (
  groupId: string,
  limit: number,
  cursorCreatedAt: string
) =>
  await sequelize.query<ResDataLatestMessageGroup>(
    `
    SELECT
      messages.notification,
      messages.id AS "messageId",
      messages.sender_id AS "senderId",
      users.first_name AS "senderName",
      users.last_name AS "senderLastName",
      messages.group_id AS "groupId",
      groups.name AS "groupName",
      messages.content,
      messages.created_at AS "createdAt"
    FROM messages
    LEFT JOIN users ON messages.sender_id = users.id
    LEFT JOIN groups ON messages.group_id = groups.id
    WHERE 
      messages.group_id = :groupId AND
      messages.deleted_at IS NULL
      ${cursorCreatedAt ? `AND messages.created_at < :cursorCreatedAt` : ""}
    ORDER BY messages.created_at DESC 
    LIMIT :limit
  `,
    {
      replacements: {
        groupId,
        limit,
        ...(cursorCreatedAt && { cursorCreatedAt }),
      },
      raw: true,
      nest: true,
      type: QueryTypes.SELECT,
    }
  );

const dropUserGroup = async (userId: string, groupId: string) => {
  await sequelize.query(
    `
    DELETE FROM users_groups
    WHERE group_id = '${groupId}' AND user_id = '${userId}'`,
    { model: UserGroup }
  );
};

const insertMessageGroup = async (
  senderId: string,
  groupId: string,
  content: string,
  messageId: string,
  notification: boolean
) =>
  await sequelize.query<Promise<{ createdAt: string } | null>>(
    `
  INSERT INTO messages (id, sender_id, receiver_id, group_id, content, notification, created_at, updated_at, deleted_at )
  VALUES ('${messageId}', '${senderId}', NULL, '${groupId}', '${content}', ${notification} ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
  RETURNING created_at as "createdAt"

  `,
    { raw: true, nest: true, type: QueryTypes.SELECT }
  );

const insertPrivateMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
  messageId: string
) =>
  await sequelize.query<Promise<{ createdAt: string } | null>>(
    `
  
  INSERT INTO messages (id, sender_id, receiver_id, group_id, content,  created_at, updated_at, deleted_at )
  VALUES ('${messageId}', '${senderId}', '${receiverId}', NULL, '${content}' ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
  RETURNING created_at as "createdAt"

  `,
    { raw: true, nest: true, type: QueryTypes.SELECT }
  );

export const listLastMessage = async (
  parseMessage: ReqMessageDTO<ParramListLastMessage>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, cursorCreatedAt } = parseMessage.params;
  const result = await getDblistLastMessage(id, limit, cursorCreatedAt);

  return { data: result };
};

export const latestMessageDialog = async (
  parseMessage: ReqMessageDTO<ParramLastMessagesDialog>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, cursorCreatedAt, receiverId } = parseMessage.params;
  const result = await getDblatestMessageDialog(
    id,
    receiverId,
    limit,
    cursorCreatedAt
  );

  return { data: result };
};

export const latestMessageGroup = async (
  parsedMessage: ReqMessageDTO<ParramLastMessagesGroup>,
  client: JwtPayload
) => {
  const { id } = client;
  const { limit, cursorCreatedAt, groupId } = parsedMessage.params;

  await checkUserGroup(id, groupId);
  const result = await getDblatestMessageGroup(groupId, limit, cursorCreatedAt);

  return { data: result };
};

export const addUserInGroup = async (
  parsedMessage: ReqMessageDTO<ParramAddUserInGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, email, firstName } = client;
  const { groupId, userId } = parsedMessage.params;
  const data: ParramsResultSuccessResponse = {
    item: {
      message: `User #${email} added in group.`,
      senderName: firstName,
    },
  };

  await checkUserGroup(id, groupId);

  await sequelize.transaction(async (trx) => {
    await insertUserGroup(groupId, userId, trx);
  });

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: string[] = transformArrUserGroup(usersInGroup);

  sendingMessages(userIds, userConnections, id, data, ADD_USER_IN_GROUP);

  return {};
};

export const leaveGroup = async (
  parsedMessage: ReqMessageDTO<ParramLeaveGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const notification = true;
  const { id, firstName, lastName } = client;
  const { groupId, message, messageId, groupName } = parsedMessage.params;

  await checkUserGroup(id, groupId);
  await dropUserGroup(id, groupId);
  const result = await insertMessageGroup(
    id,
    groupId,
    message,
    messageId,
    notification
  );

  const data: ParramsResultSuccessResponse = {
    item: {
      groupId,
      groupName,
      messageId,
      message,
      senderName: firstName,
      senderId: id,
      senderLastName: lastName,
      notification,
      createdAt: (await result[0]).createdAt,
    },
    isBroadcast: true,
  };

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: string[] = transformArrUserGroup(usersInGroup);

  sendingMessages(userIds, userConnections, id, data, LEAVE_GROUP);

  return { item: { groupId } };
};

export const sendMessageGroup = async (
  parsedMessage: ReqMessageDTO<ParramMessageGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const notification = false;
  const { id, firstName, lastName } = client;
  const { groupId, content, messageId, groupName } = parsedMessage.params;
  await checkUserGroup(id, groupId);

  const result = await insertMessageGroup(
    id,
    groupId,
    content,
    messageId,
    notification
  );

  const data: ParramsResultSuccessResponse = {
    item: {
      groupId,
      groupName,
      messageId,
      message: content,
      senderName: firstName,
      senderLastName: lastName,
      notification,
      senderId: id,
      createdAt: (await result[0]).createdAt,
    },
    isBroadcast: true,
  };
  const usersInGroup = await selectUsersGroup(groupId);

  const userIds: string[] = transformArrUserGroup(usersInGroup);
  sendingMessages(userIds, userConnections, id, data, MESSAGE_IN_GROUP);

  return {};
};

export const sendPrivateMessage = async (
  parsedMessage: ReqMessageDTO<ParramPrivateMessage>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id, firstName, lastName } = client;
  const { receiverId, content, messageId } = parsedMessage.params;
  const receiverIdArr = [receiverId];

  const result = await insertPrivateMessage(id, receiverId, content, messageId);

  const data: ParramsResultSuccessResponse = {
    item: {
      messageId,
      message: content,
      senderName: firstName,
      senderLastName: lastName,
      senderId: id,
      createdAt: (await result[0]).createdAt,
    },
    isBroadcast: true,
  };

  sendingMessages(receiverIdArr, userConnections, id, data, PRIVATE_MESSAGE);

  return {};
};

const dropGroupDB = async (groupId: string) => {
  await sequelize.query(
    `
   DELETE FROM groups WHERE id = '${groupId}';
    `,
    { model: UserGroup }
  );
};

export const deleteGroup = async (
  parsedMessage: ReqMessageDTO<ParramDropGroup>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  const { id } = client;
  const { groupId } = parsedMessage.params;
  await checkUserGroup(id, groupId);

  const data: ParramsResultSuccessResponse = {
    item: {
      groupId,
    },
    isBroadcast: true,
  };

  const usersInGroup = await selectUsersGroup(groupId);
  const userIds: string[] = transformArrUserGroup(usersInGroup);
  await dropGroupDB(groupId);
  sendingMessages(userIds, userConnections, id, data, DROP_GROUP);

  return { item: { groupId } };
};
