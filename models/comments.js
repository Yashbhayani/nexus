const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const EventsAndActivities = require('./eventsandactivities');

const Comments = sequelize.define('Comments', {
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
  ParentCommentID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'ID'
    },
    onDelete: 'CASCADE'
  },
  CommentText: {
    type: DataTypes.TEXT,
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
  }
}, {
  tableName: 'comments',
  timestamps: false
});

// 🔗 Associations
Comments.belongsTo(EventsAndActivities, { foreignKey: 'EAAID', as: 'EventActivity' });
Comments.belongsTo(User, { foreignKey: 'UID', as: 'User' });
Comments.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Comments.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

// 🧩 Self-referencing relationship for threaded comments
Comments.belongsTo(Comments, { foreignKey: 'ParentCommentID', as: 'ParentComment', onDelete: 'CASCADE' });
Comments.hasMany(Comments, { foreignKey: 'ParentCommentID', as: 'Replies' });

module.exports = Comments;
