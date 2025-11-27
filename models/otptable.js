const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const OtpTable = sequelize.define('OtpTable', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  OTPCode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  IsUsed: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
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
  }
}, {
  tableName: 'otptable',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = OtpTable;
