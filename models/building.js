const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const Building = sequelize.define('Building', {
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
  BuildingName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Location: {
    type: DataTypes.STRING(255),
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
  tableName: 'building',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = Building;
