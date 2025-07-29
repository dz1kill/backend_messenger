import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  PrimaryKey,
} from "sequelize-typescript";
import { Group } from "./group";
import { UserGroup } from "./group_user";

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING(),
  })
  firstName: string;

  @Column({
    type: DataType.STRING(),
  })
  lastName: string;

  @Column({
    type: DataType.STRING(),
    unique: true,
    allowNull: true,
  })
  email: string;

  @BelongsToMany(() => Group, () => UserGroup)
  authors: Group[];
}
