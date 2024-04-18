import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('categories', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      title_en: { type: DataTypes.STRING(255), allowNull: false },
      title_am: { type: DataTypes.STRING(255), allowNull: true },
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
      img: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('categories');
  },
});

export default migration();
