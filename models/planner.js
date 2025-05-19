const { Model } = require("sequelize");
const imageableTypeEnum = require('../enums/imageable-types.enum');

module.exports = (sequelize, DataTypes) => {
  class Planner extends Model {
    static associate(models) {
      Planner.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'staff' });
      Planner.hasOne(models.Image, {
        foreignKey: 'imageableId', constraints: false, scope: {
          imageableType: imageableTypeEnum.PLANNER
        }
      });
    }
  }

  Planner.init(
    {
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Staffs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hasVideo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      videoLink: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Planner",
    });
  return Planner;
};
