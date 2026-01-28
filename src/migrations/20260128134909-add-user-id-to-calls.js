'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('calls', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    const [users] = await queryInterface.sequelize.query('SELECT id FROM users LIMIT 1');
    if (users.length > 0) {
      await queryInterface.sequelize.query(
        `UPDATE calls SET "userId" = ${users[0].id} WHERE "userId" IS NULL`
      );
    } else {
      await queryInterface.sequelize.query('DELETE FROM calls');
    }

    await queryInterface.changeColumn('calls', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('calls', 'userId');
  }
};
