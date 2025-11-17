const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Building = require('./building');
const User = require('./user');

const Room = sequelize.define('Room', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  BID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  RoomName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Image: {
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
  tableName: 'rooms',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});



module.exports = Room;
