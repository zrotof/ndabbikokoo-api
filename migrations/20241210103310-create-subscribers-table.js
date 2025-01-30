'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Subscribers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscriberRegistrationNumber:{
        type: Sequelize.STRING,
        allowNull: false
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marriedName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false,
        values : ["Femme", "Hommes"]
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      town: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      areStatusInternalRegulationsAndMembershipAgreementAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      areRgpdConsentAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Subscribers');
  }
}