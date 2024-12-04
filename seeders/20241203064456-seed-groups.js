'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Groups', [
      {
        name: 'Lyon 4',
        country: 'France',
        town: 'Lyon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Église Lisbone',
        country: 'Portugal',
        town: 'Lisbone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Choc Toulouse',
        country: 'France',
        town: 'Toulouse',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
