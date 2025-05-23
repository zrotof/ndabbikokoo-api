"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubscriberRoles", {
      subscriberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Subscribers", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Roles", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SubscriberRoles');
  },
};