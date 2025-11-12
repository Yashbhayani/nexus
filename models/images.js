const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const UserInfo = require('./userinfo');
const Organization = require('./organization');
const EventsAndActivities = require('./eventsandactivities');
const ThirdPartyHandleAPI = require('./thirdpartyhandleapi');

const Images = sequelize.define('Images', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UIID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: UserInfo,
      key: 'ID'
    }
  },
  OID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Organization,
      key: 'ID'
    }
  },
  EAID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: EventsAndActivities,
      key: 'ID'
    }
  },
  ImageURL: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  CreatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'images',
  timestamps: false
});

// 🔗 Associations
Images.belongsTo(UserInfo, { foreignKey: 'UIID', as: 'UserInfo' });
Images.belongsTo(Organization, { foreignKey: 'OID', as: 'Organization' });
Images.belongsTo(EventsAndActivities, { foreignKey: 'EAID', as: 'EventActivity' });
Images.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Images.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Images;
