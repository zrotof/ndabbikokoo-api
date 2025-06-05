'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Planners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staffId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'Staffs'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateEnd: {
        type: Sequelize.DATE,
        allowNull: false
      },
      town: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hasVideo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      videoLink: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Planners');
  }
};
