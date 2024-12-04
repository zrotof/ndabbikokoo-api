'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', description:"Gérant des comptes utilisateurs",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deputy', description:"Gérant d'un groupe",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Member', description:"Simple adhérent",  createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};