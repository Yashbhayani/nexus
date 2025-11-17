const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const Images = require('./images');

const Organization = sequelize.define('Organization', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OrganizationUserName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ImgID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  OrganizationName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  IsApproved: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  ApproverByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  OrganizationType: {
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
  }
}, {
  tableName: 'organization',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = Organization;
