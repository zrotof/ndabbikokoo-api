"use strict";
const { Model } = require("sequelize");
const { StateEnum } = require('../enums/states.enum');
const { SolidarityActionTypeEnum } =require('../enums/solidarity-action-type.enum')

module.exports = (sequelize, DataTypes) => {
  
  class SolidarityAction extends Model {
    static associate(models) {
      SolidarityAction.belongsTo(models.Family, { foreignKey: 'familyId', as: 'family' });
      SolidarityAction.belongsTo(models.Subscriber, { foreignKey: 'subscriberId', as : 'subscriber' });  
      SolidarityAction.belongsTo(models.Staff, { foreignKey: 'staffId', as : 'staff' });  
    }
  }
  
  SolidarityAction.init(
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
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Staffs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: DataTypes.ENUM(StateEnum.ACCEPTED, StateEnum.REJECTED, StateEnum.PENDING, StateEnum.CANCELED),        
        defaultValue: StateEnum.PENDING
      },
      actionType: {
        type: DataTypes.ENUM(SolidarityActionTypeEnum.CHILDDEATH, SolidarityActionTypeEnum.MARRIAGE, SolidarityActionTypeEnum.PARENTDEATH, SolidarityActionTypeEnum.SUBSCRIBERDEATH),
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner les détails "
          }
        }
      },
      familyId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Families',
          key: 'id',
        },
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "SolidarityAction",
    }
  );
  return SolidarityAction;
};
