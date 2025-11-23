const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrganizationType = sequelize.define(
  "OrganizationType",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    SID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedByID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedByDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UpdatedByID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    IsDeleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "organizationtype",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = OrganizationType;
