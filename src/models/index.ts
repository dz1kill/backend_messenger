import * as config from "config";
import { Sequelize } from "sequelize-typescript";
import { User } from "./user";
import { Group } from "./group";
import { Message } from "./message";
import { UserGroup } from "./group_user";

const connection = new Sequelize({
  dialect: config.get("DBconfig.dialect"),
  host: config.get("DBconfig.host"),
  username: config.get("DBconfig.username"),
  password: config.get("DBconfig.password"),
  database: config.get("DBconfig.database"),
  models: [User, Group, Message, UserGroup],
});

export default connection;
