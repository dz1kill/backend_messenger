import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "users",
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING(),
    field: "first_name",
  })
  firstName: string;

  @Column({
    type: DataType.STRING(),
    field: "last_name",
  })
  lastName: string;

  @Column({
    type: DataType.STRING(),
    unique: true,
    allowNull: true,
  })
  email: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt: Date;
}
