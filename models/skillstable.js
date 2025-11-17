const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import associations
const User = require("./user");
const Status = require("./status");

const SkillsTable = sequelize.define("SkillsTable", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  UID: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "ID",
    },
    allowNull: false,
  },

  Skill: {
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

// For updating timestamp
SkillsTable.beforeUpdate(record => {
  record.UpdatedByDate = new Date();
});

module.exports = SkillsTable;
