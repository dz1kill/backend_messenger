import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import { Group } from "./group";
import { User } from "./user";

@Table({
  tableName: "users_groups",
  timestamps: false,
  underscored: true,
})
export class UserGroup extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID(),
    allowNull: false,
  })
  groupId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID(),
    allowNull: false,
  })
  userId: string;
}
