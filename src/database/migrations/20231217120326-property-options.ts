import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('property_options', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      value_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value_am: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('property_options');
  },
});

export default migration();
