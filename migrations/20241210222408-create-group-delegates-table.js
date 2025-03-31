'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('GroupDelegates', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      staffId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Staffs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });

  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupDelegates'); 
  }
};
