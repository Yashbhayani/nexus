const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const EventsAndActivities = require('./eventsandactivities');

const Like = sequelize.define('Like', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  BID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  UID: {
    type: DataTypes.INTEGER,
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
  tableName: 'like',
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      name: 'UQ_Likes_EventUser',
      fields: ['EAAID', 'UID']
    }
  ]
});


module.exports = Like;
