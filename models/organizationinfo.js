const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Organization = require('./organization');
const Status = require('./status');

const OrganizationInfo = sequelize.define('OrganizationInfo', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Role: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
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
    type: DataTypes.TINYINT,
    defaultValue: 0
  }
}, {
  tableName: 'organizationinfo',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = OrganizationInfo;
