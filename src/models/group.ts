import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  PrimaryKey,
} from "sequelize-typescript";
import { UserGroup } from "./group_user";
import { User } from "./user";
import { Message } from "./message";

@Table({
  tableName: "groups",
  timestamps: false,
  underscored: true,
})
export class Group extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(),
    defaultValue: null,
  })
  name: string;

  @BelongsToMany(() => User, () => UserGroup)
  authors: User[];

  @HasMany(() => Message)
  mssages: Message[];

  @Column({ type: DataType.DATE() })
  createdAt: Date;

  @Column({ type: DataType.DATE() })
  updatedAt: Date;
}
