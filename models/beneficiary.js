"use strict";
const { Model } = require("sequelize");

const { SexEnum } = require("../enums/sex.enum");

module.exports = (sequelize, DataTypes) => {
  class Beneficiary extends Model {
    static associate(models) {
      Beneficiary.belongsTo(models.Subscriber, {
        foreignKey: 'subscriberId',
        as: 'subscriber'
      });
    }
  }
  
  Beneficiary.init(
    {
      subscriberId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      filiation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sex: {
        type: DataTypes.ENUM(SexEnum.WOMAN, SexEnum.MAN),
        allowNull: true,
  /*
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre sexe !"
          }
        } 
  */
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
  /*
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner son adresse !"
          }
        } 
  */
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
  /*
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner son code postal !"
          }
        } 
  */
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner son pays de résidence !"
          }
        } 
      },
      town: {
        type: DataTypes.STRING,
        allowNull: true,
  /*
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner sa ville de résidence!"
          }
        } 
  */
      },
      phoneCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Beneficiary",
    }
  );
  return Beneficiary;
};
