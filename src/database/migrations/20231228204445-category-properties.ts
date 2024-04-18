import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('category_properties', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      property_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'properties',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('category_properties');
  },
});

export default migration();
