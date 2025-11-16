const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Organization = sequelize.define(
  "Organization",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OrganizationUserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    ImgID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OrganizationName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    IsApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ApproverByID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OrganizationType: {
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
  },
  {
    tableName: "organization",
    timestamps: false,
  }
);

module.exports = Organization;
