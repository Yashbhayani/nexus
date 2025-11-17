const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Building = require('./building');
const Rooms = require('./rooms');
const Images = require('./images');
const Organization = require('./organization');
const Status = require('./status');

const EventsAndActivities = sequelize.define('EventsAndActivities', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  EventActivityName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  BuildingID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  RoomID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ImgID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  StartingTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  EndingTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ApproverByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UploadDocument: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  EstimatedCostAverage: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  EventActivityStatusType: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  EventActivityType: {
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
  tableName: 'eventsandactivities',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = EventsAndActivities;
