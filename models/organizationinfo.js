const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Status = require('./status');
const Organization = require('./organization');

const OrganizationInfo = sequelize.define('OrganizationInfo', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  OID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: 'ID'
    }
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'ID'
    }
  },
  Role: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Status,
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
  tableName: 'organizationinfo',
  timestamps: false
});

// 🔗 Associations
OrganizationInfo.belongsTo(Organization, { foreignKey: 'OID', as: 'Organization' });
OrganizationInfo.belongsTo(User, { foreignKey: 'UID', as: 'User' });
OrganizationInfo.belongsTo(Status, { foreignKey: 'Role', as: 'RoleStatus' });
OrganizationInfo.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
OrganizationInfo.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = OrganizationInfo;
