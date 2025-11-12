const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Hashtags = sequelize.define('Hashtags', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Tag: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
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
  tableName: 'hashtags',
  timestamps: false
});

// 🔗 Associations
Hashtags.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Hashtags.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Hashtags;
