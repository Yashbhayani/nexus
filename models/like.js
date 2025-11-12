const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const EventsAndActivities = require('./eventsandactivities');

const Like = sequelize.define('Like', {
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
  tableName: 'like',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['EAAID', 'UID']
    }
  ]
});

// 🔗 Associations
Like.belongsTo(EventsAndActivities, { foreignKey: 'EAAID', as: 'EventActivity' });
Like.belongsTo(User, { foreignKey: 'UID', as: 'User' });
Like.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Like.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Like;
