const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const Organization = require('./organization');

const OrganizationType = sequelize.define('OrganizationType', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  SID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Status,
      key: 'ID'
    }
  },

  OID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Organization,
      key: 'ID'
    }
  },

  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },

  CreatedByDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },

  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'organizationtype',
  timestamps: false
});

// 🔗 Associations
OrganizationType.belongsTo(Status, { foreignKey: 'SID', as: 'Status' });
OrganizationType.belongsTo(Organization, { foreignKey: 'OID', as: 'Organization' });
OrganizationType.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
OrganizationType.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = OrganizationType;
