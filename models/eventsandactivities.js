const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Status = require('./status');
const Building = require('./building');
const Room = require('./rooms');
const Images = require('./images');
const Organization = require('./organization');

const EventsAndActivities = sequelize.define('EventsAndActivities', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // 🔹 New fields
  UID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
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

  EventActivityName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  BuildingID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Building,
      key: 'ID'
    }
  },

  RoomID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Room,
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

  StartingTime: {
    type: DataTypes.DATE,
    allowNull: false
  },

  EndingTime: {
    type: DataTypes.DATE,
    allowNull: false
  },

  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  ApproverByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'ID'
    }
  },

  UploadDocument: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  Overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  EstimatedCostAverage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  EventActivityStatusType: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Status,
      key: 'ID'
    }
  },

  EventActivityType: {
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
  tableName: 'eventsandactivities',
  timestamps: false
});

// 🔗 Associations
EventsAndActivities.belongsTo(User, { foreignKey: 'UID', as: 'User' });
EventsAndActivities.belongsTo(Organization, { foreignKey: 'OID', as: 'Organization' });

EventsAndActivities.belongsTo(User, { foreignKey: 'ApproverByID', as: 'Approver' });
EventsAndActivities.belongsTo(User, { foreignKey: 'CreatedByID', as: 'CreatedBy' });
EventsAndActivities.belongsTo(User, { foreignKey: 'UpdatedByID', as: 'UpdatedBy' });

EventsAndActivities.belongsTo(Status, { foreignKey: 'EventActivityStatusType', as: 'StatusType' });
EventsAndActivities.belongsTo(Status, { foreignKey: 'EventActivityType', as: 'ActivityType' });

EventsAndActivities.belongsTo(Building, { foreignKey: 'BuildingID', as: 'Building' });
EventsAndActivities.belongsTo(Room, { foreignKey: 'RoomID', as: 'Room' });

EventsAndActivities.belongsTo(Images, { foreignKey: 'ImgID', as: 'Image' });

module.exports = EventsAndActivities;
