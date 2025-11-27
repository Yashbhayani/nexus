const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const EventsAndActivities = require('./eventsandactivities');

const Comments = sequelize.define('Comments', {
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
  ParentCommentID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CommentText: {
    type: DataTypes.TEXT,
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
  tableName: 'comments',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = Comments;
