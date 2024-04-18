import { QueryInterface } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { AdminRoleEnum } from 'enums/admin-enums';

const adminSeeder = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('admins', [
      {
        id: 1,
        email: 'armrisch@gmail.com',
        first_name: 'admin',
        last_name: 'admin',
        role: AdminRoleEnum.admin,
        password: await bcrypt.hash(process.env.ADMIN_PASS, 10),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('admins', { id: 1 });
  },
});

export default adminSeeder();
