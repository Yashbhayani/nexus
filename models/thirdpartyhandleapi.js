const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const ThirdPartyHandleApi = sequelize.define('ThirdPartyHandleApi', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    allowNull: true
  },
  UpdatedID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  }
}, {
  tableName: 'thirdpartyhandleapi',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = ThirdPartyHandleApi;
