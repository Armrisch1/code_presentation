import { DataTypes, fn, QueryInterface } from 'sequelize';

const migration = () => ({
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING(100), allowNull: false },
      first_name: { type: DataTypes.STRING(150), allowNull: false },
      last_name: { type: DataTypes.STRING(150), allowNull: false },
      country: { type: DataTypes.STRING(50), allowNull: false },
      city: { type: DataTypes.STRING(150), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: false },
      postal_code: { type: DataTypes.STRING(20), allowNull: false },
      payment_status: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
        comment: '0 - pending, 1 - failed, 2 - success',
      },
      delivery_status: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
        comment: '0 - new, 1 - ongoing, 2 - delivered, 3 - canceled',
      },
      full_address: { type: DataTypes.STRING(700), allowNull: false },
      notes: { type: DataTypes.TEXT, allowNull: true },
      stripe_session_id: { type: DataTypes.STRING, allowNull: true },
      is_payment_modal_shown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: fn('now') },
      updated_at: { type: DataTypes.DATE, defaultValue: fn('now') },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('orders');
  },
});

export default migration();
