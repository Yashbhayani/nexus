const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserInfo = require('./userinfo');
const Organization = require('./organization');
const EventsAndActivities = require('./eventsandactivities');
const User = require('./user');

const Images = sequelize.define('Images', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ImageURL: {
    type: DataTypes.STRING(500),
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
  }
}, {
  tableName: 'images',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = Images;
