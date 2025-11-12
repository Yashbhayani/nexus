const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const StatusType = require('./statustype');

const Status = sequelize.define('Status', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  STID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: StatusType,
      key: 'ID'
    }
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
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'status',
  timestamps: false
});

// 🔗 Associations
Status.belongsTo(StatusType, { foreignKey: 'STID', as: 'StatusType' });
Status.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Status.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Status;
