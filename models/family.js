"use strict";
const { Model } = require("sequelize");
const { FamilyLinkTypeEnum } = require("../enums/family-link-type.enum");
const { SexEnum } = require('../enums/sex.enum');

module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    static associate(models) {
      Family.belongsTo(models.Subscriber, { foreignKey: 'subscriberId', as : 'subscriber' });
    }
  }

  Family.init(
    {
      subscriberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Subscribers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM(SexEnum.WOMAN, SexEnum.MAN),
        allowNull: false
      },
      isDead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      filiation: {
        type: DataTypes.ENUM(FamilyLinkTypeEnum.CHILD, FamilyLinkTypeEnum.PARENT, FamilyLinkTypeEnum.SPOUSE),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Family",
    }
  );
  return Family;
}