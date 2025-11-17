const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');

const BlogTable = sequelize.define('BlogTable', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PostTitle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'blogtable',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});


module.exports = BlogTable;
