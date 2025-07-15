import sequelize from "../models";
import { QueryTypes } from "sequelize";

const searchUserAndGroup = async (userId: string, searchText: string) =>
  await sequelize.query(
    `WITH user_groups AS (
    SELECT group_id
    FROM users_groups  -- Опечатка? Было users_groups или users_roups?
    WHERE user_id = :current_user_id
),

matched_users AS (
    SELECT 
        u.id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        CAST(NULL AS UUID) AS "groupId",
        NULL AS "groupName"
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
        CAST(NULL AS UUID) AS "userId",
        NULL AS "firstName",
        NULL AS "lastName",
        NULL AS email,
        g.id AS "groupId",
        g.name AS "groupName"
    FROM groups g
    WHERE g.id IN (SELECT group_id FROM user_groups)
      AND LOWER(g.name) LIKE LOWER('%' || :search_text || '%')
)

SELECT * FROM matched_users
UNION ALL
SELECT * FROM matched_groups; `,
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
