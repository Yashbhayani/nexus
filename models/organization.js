const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Status = require('./status');
const Images = require('./images');

const Organization = sequelize.define('Organization', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  OrganizationUserName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ImgID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Images,
      key: 'ID'
    }
  },
  OrganizationName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  IsApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ApproverByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },
  OrganizationType: {
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
  }
}, {
  tableName: 'organization',
  timestamps: false
});

// 🔗 Associations
Organization.belongsTo(User, { foreignKey: 'ApproverByID', as: 'Approver' });
Organization.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Organization.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });
Organization.belongsTo(Status, { foreignKey: 'OrganizationType', as: 'Type' });
Organization.belongsTo(Images, { foreignKey: 'ImgID', as: 'Image' });

module.exports = Organization;
