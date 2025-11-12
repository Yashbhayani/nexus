const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Status = require('./status');
const EventsAndActivities = require('./eventsandactivities');

const ManageEventAndActivities = sequelize.define('ManageEventAndActivities', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  EAAID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EventsAndActivities,
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
  StatusID: {
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
  tableName: 'manageeventandactivities',
  timestamps: false
});

// 🔗 Associations
ManageEventAndActivities.belongsTo(EventsAndActivities, { foreignKey: 'EAAID', as: 'EventActivity' });
ManageEventAndActivities.belongsTo(User, { foreignKey: 'UID', as: 'User' });
ManageEventAndActivities.belongsTo(Status, { foreignKey: 'StatusID', as: 'Status' });
ManageEventAndActivities.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
ManageEventAndActivities.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = ManageEventAndActivities;
