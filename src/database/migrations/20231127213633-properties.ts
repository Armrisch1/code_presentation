import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('properties', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name_en: { type: DataTypes.STRING, allowNull: false },
      name_am: { type: DataTypes.STRING, allowNull: true },
      type: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        comment: '1 - Numeric 2 - Text 3 - List',
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('properties');
  },
});

export default migration();
