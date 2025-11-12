const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user'); // Assuming you already have the User model

const StatusType = sequelize.define('StatusType', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'statustype',
  timestamps: false
});

// 🔗 Associations
StatusType.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
StatusType.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = StatusType;
