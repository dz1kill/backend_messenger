import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Message } from "./message";

@Table({
  tableName: "images",
  timestamps: true,
  underscored: true,
})
export class Image extends Model {
  @Column({
    type: DataType.INTEGER(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Message)
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
  })
  messageId: number;

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
