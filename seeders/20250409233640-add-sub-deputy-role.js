'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE code = 'sub_deputy'`
    );

    if (results.length === 0) {
      // Le rôle n'existe pas, on l'insère
      await queryInterface.bulkInsert('Roles', [
        {
          code: 'sub_deputy',
          name: 'Sous-Délégué',
          description: 'Sous-délégué de groupe',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } else {
      console.log('Le rôle "supervisor" existe déjà. Aucun ajout effectué.');
    }
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
      code: 'sub_deputy'
    }, {});
  }
};
