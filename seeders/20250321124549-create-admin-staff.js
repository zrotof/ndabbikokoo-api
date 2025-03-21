"use strict";

const {
  generateHashedPasswordAndSalt,
} = require("../helpers/password.helpers");

const {
  generateRegistrationNumber,
} = require("../utils/generate-registration-number");

const SubscriberStatusEnum = require("../enums/subscriber-status.enum");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const registrationNumber = generateRegistrationNumber(6);

    const subscribers = await queryInterface.bulkInsert(
      "Subscribers",
      [
        {
          subscriberRegistrationNumber: registrationNumber,
          firstname: "Admin",
          lastname: "Supra",
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
      ],
      { returning: true }
    );

    const subscriberId = subscribers[0].id;
    const passHash = generateHashedPasswordAndSalt("admin");

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          subscriberId: subscriberId,
          email: "nadkombang@gmail.com",
          password: passHash.hash,
          canAuthenticate: true,
          isAccountValidated: true,
          isEmailConfirmed: true,
          salt: passHash.salt,
          status: SubscriberStatusEnum.ACTIF,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        returning: true,
      }
    );

    const roles = await queryInterface.sequelize.query(
      'SELECT id, name, code FROM "Roles" WHERE code IN (:roleCodes)',
      {
        replacements: { roleCodes: ["admin"] },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const adminRoleId = roles.find((role) => role.code === "admin")?.id;

    if (adminRoleId) {
      await queryInterface.bulkInsert("SubscriberRoles", [
        {
          subscriberId: subscriberId,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ])
    }

    await queryInterface.bulkInsert(
      "Staffs",
      [
        {
          subscriberId: subscriberId,
          email: "nadkombang@gmail.com",
          password: passHash.hash,
          salt: passHash.salt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        returning: true,
      }
    )

    await queryInterface.bulkInsert(
      "StaffRoles",
      [
        {
          staffId: 1,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        returning: true,
      }
    )
  },
  async down(queryInterface, Sequelize) {
    return ;
  },
};
