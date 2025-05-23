"use strict";
const { Model } = require("sequelize");

const SubscriberStatusEnum = require("../enums/subscriber-status.enum");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Subscriber, { foreignKey: 'subscriberId', as : 'subscriber'});
      User.hasMany(models.IdRequest, { foreignKey: 'userId', as : 'user'});
    }
  }

  User.init(
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
      canAuthenticate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isAccountValidated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(...Object.values(SubscriberStatusEnum)),
        defaultValue: SubscriberStatusEnum.ENATTENTE
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
