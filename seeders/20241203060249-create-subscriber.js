"use strict";

const {
  generateHashedPasswordAndSalt,
} = require("../helpers/password.helpers");
const {
  generateRegistrationNumber,
} = require("../utils/generate-registration-number");

module.exports = {
  async up(queryInterface, Sequelize) {
    const registrationNumber1 = generateRegistrationNumber(6);
    const registrationNumber2 = generateRegistrationNumber(6);

    // Create two Subscribers
    const subscribers = await queryInterface.bulkInsert(
      "Subscribers",
      [
        {
          subscriberRegistrationNumber: registrationNumber1,
          firstname: "John",
          lastname: "Doe",
          sex: "Homme",
          address: "123 Rue Exemple",
          postalCode: "75000",
          country: "France",
          town: "Paris",
          phoneNumber: "0123456789",
          phoneCode: "+33",
          areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
          areRgpdConsentAccepted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberRegistrationNumber: registrationNumber2,
          firstname: "Jane",
          lastname: "Doe",
          sex: "Femme",
          address: "456 Rue de Tankoua",
          postalCode: "75000",
          country: "France",
          town: "Paris",
          phoneNumber: "0987654321",
          phoneCode: "+33",
          areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
          areRgpdConsentAccepted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberRegistrationNumber: registrationNumber2,
          firstname: "Sidoine",
          lastname: "Atangana",
          sex: "Homme",
          address: "456 Rue de Tankoua",
          postalCode: "75000",
          country: "France",
          town: "Paris",
          phoneNumber: "45678943",
          phoneCode: "+33",
          areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
          areRgpdConsentAccepted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    // Get the subscriberIds of the newly created subscribers
    const subscriberId1 = subscribers[0].id;
    const subscriberId2 = subscribers[1].id;
    const subscriberId3 = subscribers[2].id;

    const passHash1 = generateHashedPasswordAndSalt("john");
    const passHash2 = generateHashedPasswordAndSalt("jane");
    const passHash3 = generateHashedPasswordAndSalt("test");
    // Create two Users for the Subscribers
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          subscriberId: subscriberId1,
          email: "john@maholdiaspora.com",
          password: passHash1.hash, // Be sure to hash the password before inserting
          canAuthenticate: true,
          isAccountValidated: true,
          isEmailConfirmed: true,
          salt: passHash1.salt, // You should generate the salt programmatically
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberId: subscriberId2,
          email: "jane@maholdiaspora.com",
          password: passHash2.hash, // Be sure to hash the password before inserting
          canAuthenticate: true,
          isAccountValidated: true,
          isEmailConfirmed: true,
          salt: passHash2.salt, // You should generate the salt programmatically
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberId: subscriberId3,
          email: "test@maholdiaspora.com",
          password: passHash3.hash, // Be sure to hash the password before inserting
          canAuthenticate: true,
          isAccountValidated: true,
          isEmailConfirmed: true,
          salt: passHash3.salt, // You should generate the salt programmatically
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {
        returning: true,
      }
    );

    // Assume roles already exist and we will link them to the users
    // Query roles to get the roleIds for 'Admin' and 'Member'
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Roles" WHERE name IN (:roleNames)',
      {
        replacements: { roleNames: ["Admin", "Member"] },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const adminRoleId = roles.find((role) => role.name === "Admin")?.id;
    const memberRoleId = roles.find((role) => role.name === "Member")?.id;

    // Check if the roles exist and link them to the users
    if (adminRoleId && memberRoleId) {
      await queryInterface.bulkInsert("SubscriberRoles", [
        {
          subscriberId: subscriberId1,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberId: subscriberId2,
          roleId: memberRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          subscriberId: subscriberId3,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all data if rolling back
    await queryInterface.bulkDelete("SubscriberRoles", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Subscribers", null, {});
  },
};
