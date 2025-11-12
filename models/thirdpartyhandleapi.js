const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const ThirdPartyHandleAPI = sequelize.define('ThirdPartyHandleAPI', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  URL: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  FolderName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  CreatedID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  UpdatedID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'thirdpartyhandleapi',
  timestamps: false
});

// 🔗 Associations
ThirdPartyHandleAPI.belongsTo(User, { foreignKey: 'CreatedID', as: 'CreatedBy' });
ThirdPartyHandleAPI.belongsTo(User, { foreignKey: 'UpdatedID', as: 'UpdatedBy' });

module.exports = ThirdPartyHandleAPI;
