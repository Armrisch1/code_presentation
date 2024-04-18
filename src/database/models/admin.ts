import { BaseModel } from 'models/base';
import { Column, DataType, Table } from 'sequelize-typescript';
import { AdminRoleEnum } from 'enums/admin-enums';

@Table({
  tableName: 'admins',
})
export class Admin extends BaseModel<Admin> {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  lastName: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  role: AdminRoleEnum;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
