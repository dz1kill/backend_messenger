import * as config from "config";
import { Sequelize } from "sequelize-typescript";
import { User } from "./user";

const connection = new Sequelize({
  dialect: config.get("DBconfig.dialect"),
  host: config.get("DBconfig.host"),
  username: config.get("DBconfig.username"),
  password: config.get("DBconfig.password"),
  database: config.get("DBconfig.database"),
  models: [User],
});

export default connection;
