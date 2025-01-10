"use strict";
const { GroupTypeEnum } = require('../enums/group-type.enum');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Groups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maholGroupId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      representativeId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      groupType: {
        type: Sequelize.ENUM(GroupTypeEnum.ASSOCIATION, GroupTypeEnum.STAFF),
        allowNull: false
    },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      town: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Groups");
  },
}