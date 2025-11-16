const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Building = require('./building');

const Room = sequelize.define('Room', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  BID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Building,
      key: 'ID'
    }
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
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
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
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'rooms',
  timestamps: false
});

module.exports = Room;
