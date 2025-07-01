import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Message } from "./message";
import { UUID } from "crypto";

@Table({
  tableName: "images",
  timestamps: true,
  underscored: true,
})
export class Image extends Model {
  @Column({
    type: DataType.UUIDV4(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: UUID;

  @ForeignKey(() => Message)
  @Column({
    type: DataType.UUID(),
    allowNull: false,
  })
  messageId: string;

  @BelongsTo(() => Message)
  messages: Message;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  url: string;
}
