import {
  Table,
  Column,
  Model,
  CreatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";
import { Group } from "./group";

@Table({
  tableName: "messages",
})
export class Message extends Model {
  @Column({
    type: DataType.INTEGER(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
    field: "user_id",
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
    field: "group_id",
  })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  content: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt: Date;
}
