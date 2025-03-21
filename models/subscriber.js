"use strict";
const { Model } = require("sequelize");

const imageableTypeEnum = require('../enums/imageable-types.enum');

module.exports = (sequelize, DataTypes) => {
  class Subscriber extends Model {
    
    getFullName() {
      return [this.firstname, this.lastname].join(' ');
    }

    static associate(models) { 
      Subscriber.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Subscriber.hasOne(models.User, { foreignKey: 'subscriberId', as: 'user', onDelete: 'CASCADE' });
      Subscriber.belongsToMany(models.Role, { through: 'SubscriberRoles', foreignKey: 'subscriberId', as : 'roles' });
      Subscriber.hasOne(models.Group, { foreignKey: 'representativeId', as: 'representative' });
      Subscriber.hasOne(models.StaffRequest, { foreignKey: 'subscriberId', as: 'staffRequest' });
      Subscriber.hasMany(models.Family, { foreignKey: 'subscriberId', as: 'families' });
      Subscriber.hasOne(models.Image, { foreignKey: 'imageableId', constraints: false, scope: {
        imageableType: imageableTypeEnum.SUBSCRIBER
      }, as: 'image' });
    }
  }

  Subscriber.init(
    {
      subscriberRegistrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Erreur lors de l'enregistrement veuillez contacter le web master !"
        }
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Groups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner votre/vos prénom(s) !'
          }
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Veuillez renseigner votre/vos nom(s) !'
          }
        }
      },
      marriedName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sex: {
        type: DataTypes.ENUM('Femme', 'Homme'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre sexe !"
          }
        } 
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre adresse !"
          }
        } 
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre code postal !"
          }
        } 
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre pays !"
          }
        } 
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre ville !"
          }
        } 
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner votre numéro de téléphone !"
          }
        } 
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Veuillez renseigner le code indicatif de votre pays en selectionnant votre pays !"
          }
        } 
      },
      is_contribution_up_to_date: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      areStatusInternalRegulationsAndMembershipAgreementAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notEmpty: {
            msg: "Veuillez accepter les statuts, le règlement intérieur et la convention d'adhésion de Mahol!"
          }
        } 
      },
      areRgpdConsentAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notEmpty: {
            msg: "Veuillez reconnaitre avoir été informé(e) et avoir consentit au traitement de vos données dans la Politique de confidentialité de Mahol"
          }
        }
      }
    },
    {
      sequelize,
      modelName: "Subscriber",
    }
  );
  return Subscriber;
};