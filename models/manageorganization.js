const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import related models
const User = require("./user");
const Status = require("./status");
const Organization = require("./organization");

const ManageOrganization = sequelize.define(
  "ManageOrganization",
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
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    IsRemove: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "manageorganization",
    timestamps: false, // Because you're manually using CreatedDate/UpdatedDate
  }
);

module.exports = ManageOrganization;
