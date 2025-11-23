const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Import related models
const Status = require('./status');
const EventsAndActivities = require('./eventsandactivities');
const User = require('./user');

const EventsAndActivitiesType = sequelize.define(
  'EventsAndActivitiesType',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    SID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    EID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CreatedByID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedByDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdatedByID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    IsDeleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'eventsandactivitiestype',
    timestamps: false
  }
);
module.exports = EventsAndActivitiesType;
