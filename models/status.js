const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const StatusType = require('./statustype');

const Status = sequelize.define('Status', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  STID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
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
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'status',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});



module.exports = Status;
