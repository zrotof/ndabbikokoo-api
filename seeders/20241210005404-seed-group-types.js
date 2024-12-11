"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "GroupTypes",
      [
        {
          name: "Standard",
          description: "Groupe créé par mahol",
          createdAt: new Date(),
          updatedAt: new Date()  
        },
        {
          name: "Association",
          description: "Groupe créé par une association",
          createdAt: new Date(),
          updatedAt: new Date()  
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("GroupTypes", null, {});
  },
};
