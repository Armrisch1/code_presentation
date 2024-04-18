import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('admins', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      first_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      role: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
        comment: '0 - admin, 1 - superAdmin',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('admins');
  },
});

export default migration();
