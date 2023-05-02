import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Group } from "./group";
import { User } from "./user";

@Table({
  tableName: "users_groups",
})
export class UserGroup extends Model {
  @Column({
    type: DataType.INTEGER(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
    field: "group_id",
  })
  groupId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
    field: "user_id",
  })
  userId: number;
}
