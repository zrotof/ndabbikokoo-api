'use strict';

const { generateHashedPasswordAndSalt } = require('../helpers/password.helpers')

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create two Subscribers
    const subscribers = await queryInterface.bulkInsert('Subscribers', [{
      firstname: 'John',
      lastname: 'Doe',
      sex: 'Homme',
      address: '123 Rue Exemple',
      postalCode: '75000',
      country: 'France',
      town: 'Paris',
      phoneNumber: '0123456789',
      phoneCode: '+33',
      areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
      areRgpdConsentAccepted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      firstname: 'Jane',
      lastname: 'Doe',
      sex: 'Femme',
      address: '456 Rue Exemple',
      postalCode: '75000',
      country: 'France',
      town: 'Paris',
      phoneNumber: '0987654321',
      phoneCode: '+33',
      areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
      areRgpdConsentAccepted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], { returning: true });

    // Get the subscriberIds of the newly created subscribers
    const subscriberId1 = subscribers[0].id;
    const subscriberId2 = subscribers[1].id;

    const passHash1 = generateHashedPasswordAndSalt('Admin')
    const passHash2 = generateHashedPasswordAndSalt('Admin')
    // Create two Users for the Subscribers
    const users = await queryInterface.bulkInsert('Users', [{
      subscriberId: subscriberId1,
      email: 'manduel21@gmail.com',
      password: passHash1.hash, // Be sure to hash the password before inserting
      canAuthenticate: true,
      isAccountValidated: true,
      isEmailConfirmed: true,
      salt: passHash1.salt, // You should generate the salt programmatically
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      subscriberId: subscriberId2,
      email: 'jane.doe@example.com',
      password: passHash2.hash, // Be sure to hash the password before inserting
      canAuthenticate: true,
      isAccountValidated: true,
      isEmailConfirmed: true,
      salt: passHash2.salt, // You should generate the salt programmatically
      createdAt: new Date(),
      updatedAt: new Date(),
    }], { returning: true });

    // Get the userIds of the newly created users
    const userId1 = users[0].id;
    const userId2 = users[1].id;

    // Assume roles already exist and we will link them to the users
    // Query roles to get the roleIds for 'Admin' and 'Member'
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Roles" WHERE name IN (:roleNames)', 
      {
        replacements: { roleNames: ['Admin', 'Member'] }, 
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const adminRoleId = roles.find(role => role.name === 'Admin')?.id;
    const memberRoleId = roles.find(role => role.name === 'Member')?.id;

    // Check if the roles exist and link them to the users
    if (adminRoleId && memberRoleId) {
      await queryInterface.bulkInsert('UserRoles', [{
        userId: userId1,
        roleId: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        userId: userId2,
        roleId: memberRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    }

  },

  async down(queryInterface, Sequelize) {
    // Remove all data if rolling back
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Subscribers', null, {});
  }
};
