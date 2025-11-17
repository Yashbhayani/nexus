const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');

const Followers = sequelize.define('Followers', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FollowerID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  FollowingID: {
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
  tableName: 'followers',
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      name: 'UQ_Followers',
      fields: ['FollowerID', 'FollowingID']
    }
  ]
});

module.exports = Followers;
