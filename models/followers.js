const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Followers = sequelize.define('Followers', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  FollowerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'ID'
    }
  },
  FollowingID: {
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
  tableName: 'followers',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['FollowerID', 'FollowingID']
    }
  ]
});

// 🔗 Associations
Followers.belongsTo(User, { foreignKey: 'FollowerID', as: 'Follower' });
Followers.belongsTo(User, { foreignKey: 'FollowingID', as: 'Following' });
Followers.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
Followers.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = Followers;
