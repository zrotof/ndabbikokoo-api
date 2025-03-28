'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { name: 'Super Administrateur', code: "super_admin", description:"Gérant des comptes utlisateurs à partir du niveau supra",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Administrateur', code: "admin", description:"Gérant des comptes utilisateurs à partir du niveau admin",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Délégué', code: "deputy", description:"Délégué d'un groupe",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Representant', code: "representative", description:"Représentant d'un groupe",  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adhérent', code: "member", description:"Simple adhérent",  createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};