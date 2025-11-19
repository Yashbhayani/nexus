const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import related models
const Organization = require("./organization");
const User = require("./user");
const Building = require("./building");
const Rooms = require("./rooms");

const OrganizationInfo = sequelize.define(
  "OrganizationInfo",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    OID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    BID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    RID: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "organizationinfo",
    timestamps: false, // since you're using custom timestamps
  }
);

module.exports = OrganizationInfo;
