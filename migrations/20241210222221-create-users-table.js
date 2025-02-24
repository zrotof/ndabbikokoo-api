'use strict';
/** @type {import('sequelize-cli').Migration} */

const SubscriberStatusEnum = require('../enums/subscriber-status.enum');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscriberId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Subscribers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canAuthenticate: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      isAccountValidated: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      isEmailConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(...Object.values(SubscriberStatusEnum)),
        defaultValue: SubscriberStatusEnum.ENATTENTE
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};