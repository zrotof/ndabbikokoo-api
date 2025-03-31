"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class Staff extends Model {
    static associate(models) {
      Staff.belongsTo(models.Subscriber, { foreignKey: 'subscriberId', as : 'subscriber' });
      Staff.belongsToMany(models.Role, { through: 'StaffRoles', foreignKey: 'staffId', as: 'roles' });
      Staff.hasMany(models.Group, { foreignKey: 'representativeId' });
      Staff.hasMany(models.GroupStaff, { foreignKey: 'staffId', as : 'groups' });
      Staff.hasMany(models.GroupDelegate, { foreignKey: 'staffId', as : 'groupsDelegate' });
      Staff.hasMany(models.SolidarityAction, { foreignKey: 'staffId', as : 'solidariryActions' });
    }
  }

  Staff.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Cet email existe déjà, vous ne pouvez la re-utiliser !'
        },
        validate: {
          isEmail: {
            msg: "L'email n'est pas bien formaté !"
          },
          notEmpty: {
            msg: "Veuillez renseigner l'email !"
          }
        } 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner le mot de passe !'
          }
        }
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );

  return Staff;
}