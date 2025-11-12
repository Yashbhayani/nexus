const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const UserType = require('./usertype'); // Assuming you already created this

const User = sequelize.define('User', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UTID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    references: {
      model: UserType,
      key: 'ID'
    }
  },
  FirstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  MobileNumber: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false
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
  tableName: 'user',
  timestamps: false
});

// Define association
User.belongsTo(UserType, { foreignKey: 'UTID', as: 'UserType' });

module.exports = User;
