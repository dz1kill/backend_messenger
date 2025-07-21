import sequelize from "../models";
import { QueryTypes, Transaction } from "sequelize";
import { Group } from "../models/group";
import { UserGroup } from "../models/group_user";

const searchUserAndGroup = async (userId: string, searchText: string) =>
  await sequelize.query(
    `WITH user_groups AS (
    SELECT group_id FROM users_groups WHERE user_id = :current_user_id
),

matched_users AS (
    SELECT 
        u.id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        NULL::UUID AS "groupId",
        NULL AS "groupName",
        CASE
            WHEN LOWER(u.first_name) LIKE LOWER(:search_text || '%') THEN 1
            WHEN LOWER(u.last_name) LIKE LOWER(:search_text || '%') THEN 2
            WHEN LOWER(u.first_name) LIKE LOWER('%' || :search_text || '%') THEN 3
            WHEN LOWER(u.last_name) LIKE LOWER('%' || :search_text || '%') THEN 4
            ELSE 5
        END AS priority
    FROM users u
    WHERE u.id != :current_user_id
      AND (
          LOWER(u.first_name) LIKE LOWER('%' || :search_text || '%')
          OR LOWER(u.last_name) LIKE LOWER('%' || :search_text || '%')
          OR LOWER(u.email) LIKE LOWER('%' || :search_text || '%')
      )
),

matched_groups AS (
    SELECT 
        NULL::UUID AS "userId",
        NULL AS "firstName",
        NULL AS "lastName",
        NULL AS email,
        g.id AS "groupId",
        g.name AS "groupName",
        CASE WHEN LOWER(g.name) LIKE LOWER(:search_text || '%') THEN 1 ELSE 2 END AS priority
    FROM groups g
    WHERE g.id IN (SELECT group_id FROM user_groups)
      AND LOWER(g.name) LIKE LOWER('%' || :search_text || '%')
)

SELECT * FROM matched_users
UNION ALL
SELECT * FROM matched_groups
ORDER BY priority, "firstName", "lastName", "groupName";
`,
    {
      replacements: {
        current_user_id: userId,
        search_text: searchText,
      },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    }
  );

const messageDeletionRepository = async (userId: string, companionId: string) =>
  await sequelize.query(
    `
    UPDATE messages
    SET deleted_by_users = array_append(deleted_by_users, :user_id)
    WHERE 
      (sender_id = :user_id AND receiver_id = :companion_id)
      OR 
      (sender_id = :companion_id AND receiver_id = :user_id) 
      AND 
      NOT (:user_id = ANY(deleted_by_users))
    RETURNING *`,
    {
      replacements: {
        user_id: userId,
        companion_id: companionId,
      },
      type: QueryTypes.UPDATE,
    }
  );

const insertGroup = async (
  groupName: string,
  trx: Transaction,
  groupId: string
) =>
  await sequelize.query(
    `
  INSERT INTO groups (id , name, created_at, updated_at, deleted_at )
  VALUES ('${groupId}','${groupName}',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
  RETURNING id;
  `,
    { raw: true, nest: true, model: Group, transaction: trx }
  );

const insertMessageGroup = async (
  senderId: string,
  groupId: string,
  content: string,
  messageId: string,
  notification: boolean,
  trx: Transaction
) =>
  await sequelize.query<Promise<{ createdAt: string } | null>>(
    `
    INSERT INTO messages (id, sender_id, receiver_id, group_id, content, notification,  created_at, updated_at, deleted_at )
    VALUES ('${messageId}', '${senderId}', NULL, '${groupId}', '${content}', ${notification}  ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , NULL )
    RETURNING created_at as "createdAt"
  
    `,
    { raw: true, nest: true, type: QueryTypes.SELECT, transaction: trx }
  );

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

export async function findUserAndGroup(id: string, searchText: string) {
  const result = await searchUserAndGroup(id, searchText);
  return { data: result };
}

export async function markMessageAsDeleted(
  userId: string,
  companionId: string
) {
  await messageDeletionRepository(userId, companionId);
  return { message: "User's messages have been deleted" };
}

export const newGroup = async (
  id: string,
  groupName: string,
  groupId: string,
  notificationMessage: string,
  messageId: string
) => {
  await sequelize.transaction(async (trx) => {
    await insertGroup(groupName, trx, groupId);
    await insertUserGroup(groupId, id, trx);
    await insertMessageGroup(
      id,
      groupId,
      notificationMessage,
      messageId,
      true,
      trx
    );
  });

  return { statusCode: 200, message: "Create group succes" };
};
