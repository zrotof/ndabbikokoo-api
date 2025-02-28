"use strict";

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class IdRequest extends Model{
    static associate(models) {
      IdRequest.belongsTo(models.User , {
        foreignKey : 'userId', as: 'user'
      });
    }
  }

  IdRequest.init(
    {
      userId : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false, 
        unique: true,
      },
      expires_at: { 
        type: DataTypes.DATE, 
        allowNull: false 
      },
      isAlreadyUsed: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "IdRequest",
      tableName: "Id_Requests"
    }
  );
  return IdRequest;
}