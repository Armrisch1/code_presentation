import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('products', {
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
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      qty: { type: DataTypes.INTEGER, allowNull: false },
      title_en: { type: DataTypes.STRING(255), allowNull: false },
      title_am: { type: DataTypes.STRING(255), allowNull: true },
      description_en: { type: DataTypes.TEXT, allowNull: true },
      description_am: { type: DataTypes.TEXT, allowNull: true },
      short_description_en: { type: DataTypes.STRING(255), allowNull: false },
      short_description_am: { type: DataTypes.STRING(255), allowNull: true },
      meta_title: { type: DataTypes.STRING(150), allowNull: true },
      meta_description: { type: DataTypes.STRING(255), allowNull: true },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_top: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_bestseller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      age: {
        type: DataTypes.INTEGER({ length: 2 }),
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('products');
  },
});

export default migration();
