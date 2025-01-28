'use strict';

const { SexEnum } = require('../enums/sex.enum');
const { FiliationEnum } = require('../enums/filiation.enum');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Families', {
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
        onDelete: 'SET NULL'
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname : {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false,
        values : [SexEnum.WOMAN, SexEnum.MAN]
      },
      isDead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      filiation: {
        type: Sequelize.STRING,
        allowNull: false,
        values : [ FiliationEnum.CHILD, FiliationEnum.PARENT ]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Families');
  }
};
