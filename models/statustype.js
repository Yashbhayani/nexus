const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const StatusType = sequelize.define('StatusType', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
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
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'statustype',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});



module.exports = StatusType;
