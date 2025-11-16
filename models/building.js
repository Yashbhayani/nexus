const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Building = sequelize.define('Building', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
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
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'building',
  timestamps: false
});

module.exports = Building;
