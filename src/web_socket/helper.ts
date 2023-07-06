import sequelize from "../models";

import { UserGroup } from "../models/group_user";

export const getGroupsUser = async (id: number) => {
  return await sequelize.query(
    `SELECT group_id as "groupId"
      FROM users_groups
      WHERE user_id = ${id} 
  `,
    {
      raw: true,
      nest: true,
      model: UserGroup,
    }
  );
};

export const parseBufferToJson = (rawMessageBuff: Buffer) => {
  const rawMessage = rawMessageBuff.toString();
  return JSON.parse(rawMessage);
};
