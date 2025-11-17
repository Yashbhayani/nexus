const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const EventsAndActivities = require('./eventsandactivities');

const ManageEventAndActivities = sequelize.define('ManageEventAndActivities', {
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
  StatusID: {
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
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  }
}, {
  tableName: 'manageeventandactivities',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = ManageEventAndActivities;
