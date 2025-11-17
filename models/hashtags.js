const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const Hashtags = sequelize.define('Hashtags', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Tag: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
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
  tableName: 'hashtags',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = Hashtags;
