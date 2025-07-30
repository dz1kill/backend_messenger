import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
} from "sequelize-typescript";
import { User } from "./user";
import { Group } from "./group";
import { UUID } from "crypto";

@Table({
  tableName: "messages",
  timestamps: true,
  underscored: true,
})
export class Message extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    defaultValue: [],
  })
  deletedByUsers: string[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID(),
    allowNull: false,
  })
  senderId: string;

  @BelongsTo(() => User)
  sender: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID(),
  })
  receiverId: string;

  @BelongsTo(() => User)
  receiver: User;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID(),
  })
  groupId: string;

  @BelongsTo(() => Group)
  group: Group;

  @Column({
    type: DataType.STRING(),
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN(),
  })
  notification: string;
}
