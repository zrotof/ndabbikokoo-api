'use strict';

const { generateRegistrationNumber } = require("../utils/generate-registration-number");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const subscribers = await queryInterface.sequelize.query(
      `SELECT id FROM "Subscribers"`
    );

    await queryInterface.bulkInsert('Groups', [
      { groupRegistrationNumber: generateRegistrationNumber(7), name: 'Lyon 4', country: "France", town:"Lyon", isCreatedByMahol: true, createdAt: new Date(), updatedAt: new Date() },
      { groupRegistrationNumber: generateRegistrationNumber(7), representativeId: subscribers[0][0].id, name: 'Le choc', isCreatedByMahol: false, country: "France", town:"Toulouse", createdAt: new Date(), updatedAt: new Date() },
      { groupRegistrationNumber: generateRegistrationNumber(7), name: 'Paris 12e', country: "France", town:"Paris", isCreatedByMahol: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {}); 
  }
};
