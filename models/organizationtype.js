const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const Organization = require('./organization');

const OrganizationType = sequelize.define('OrganizationType', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  OID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedByDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'organizationtype',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});



module.exports = OrganizationType;
