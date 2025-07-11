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
    WHERE g.id NOT IN (SELECT group_id FROM user_groups)
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

export async function findUserAndGroup(id: string, searchText: string) {
  const result = await searchUserAndGroup(id, searchText);
  return { data: result };
}
