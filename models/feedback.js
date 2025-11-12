const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Status = require('./status');
const EventsAndActivities = require('./eventsandactivities');

const Feedback = sequelize.define('Feedback', {
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
  Response: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Status,
      key: 'ID'
    }
  },
  Feedback: {
    type: DataTypes.TEXT,
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
  tableName: 'feedback',
  timestamps: false
});

// 🔗 Associations
Feedback.belongsTo(EventsAndActivities, { foreignKey: 'EAAID', as: 'EventActivity' });
Feedback.belongsTo(User, { foreignKey: 'UID', as: 'User' });
Feedback.belongsTo(Status, { foreignKey: 'Response', as: 'ResponseStatus' });
Feedback.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Feedback.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Feedback;
