'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { name: 'Administrateur', code: "admin", description:"Gérant des comptes utilisateurs",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deputé', code: "deputy", description:"Délégué d'un groupe",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Representant', code: "representative", description:"Représentant d'un groupe",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adhérent', code: "member", description:"Simple adhérent",  createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};