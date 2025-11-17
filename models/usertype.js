const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // adjust path if needed

const UserType = sequelize.define('UserType', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  CreatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usertype',
  timestamps: false, // You are already managing your own timestamps
  createdAt: false,
  updatedAt: false
});

module.exports = UserType;
