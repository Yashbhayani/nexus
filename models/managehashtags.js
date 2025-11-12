const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Hashtag = require('./hashtags');

const ManageHashtags = sequelize.define('ManageHashtags', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  HashtagID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hashtag,
      key: 'ID'
    }
  },
  EntityID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  EntityType: {
    type: DataTypes.STRING(50),
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
  tableName: 'managehashtags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['HashtagID', 'EntityID', 'EntityType']
    }
  ]
});

// 🔗 Associations
ManageHashtags.belongsTo(Hashtag, { foreignKey: 'HashtagID', as: 'Hashtag' });
ManageHashtags.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
ManageHashtags.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = ManageHashtags;
