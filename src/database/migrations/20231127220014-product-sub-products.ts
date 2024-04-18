import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('product_sub_products', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      sub_product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
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
    await queryInterface.dropTable('product_sub_products');
  },
});

export default migration();
