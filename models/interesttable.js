const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import related models
const User = require("./user");
const Status = require("./status");

const InterestTable = sequelize.define("InterestTable", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  UID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "ID",
    },
  },

  SID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Status,
      key: "ID",
    },
  },

  Interest: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },

  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  UpdatedByID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  CreatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  UpdatedByDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Auto-update timestamp
InterestTable.beforeUpdate((record) => {
  record.UpdatedByDate = new Date();
});

module.exports = InterestTable;
