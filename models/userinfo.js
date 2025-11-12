const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Status = require('./status');
const StatusType = require('./statustype');
const Images = require('./images');

const UserInfo = sequelize.define('UserInfo', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'ID'
    }
  },
  BIO: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  StudentType: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: StatusType,
      key: 'ID'
    }
  },
  Majors: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Status,
      key: 'ID'
    }
  },
  ImgID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Images,
      key: 'ID'
    }
  },
  Gender: {
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
  tableName: 'userinfo',
  timestamps: false
});

// 🔗 Associations
UserInfo.belongsTo(User, { foreignKey: 'UID', as: 'User' });
UserInfo.belongsTo(StatusType, { foreignKey: 'StudentType', as: 'StudentTypeInfo' });
UserInfo.belongsTo(Status, { foreignKey: 'Majors', as: 'MajorStatus' });
UserInfo.belongsTo(Status, { foreignKey: 'Gender', as: 'GenderStatus' });
UserInfo.belongsTo(Images, { foreignKey: 'ImgID', as: 'ProfileImage' });
UserInfo.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
UserInfo.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

module.exports = UserInfo;
