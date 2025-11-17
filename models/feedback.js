const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const EventsAndActivities = require('./eventsandactivities');

const Feedback = sequelize.define('Feedback', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  EAAID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Response: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Feedback: {
    type: DataTypes.TEXT,
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
  tableName: 'feedback',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = Feedback;
