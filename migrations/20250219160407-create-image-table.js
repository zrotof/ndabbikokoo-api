"use strict";

const imageableTypes = require("../enums/imageable-types.enum");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Images", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publicId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      imageableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imageableType: {
        type: Sequelize.ENUM(...Object.values(imageableTypes)),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Images", ["imageableId", "imageableType"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Images");
  },
};
