const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Import other models for associations
const User = require("./user");
const Status = require("./status");
const StatusType = require("./statustype");
const Images = require("./images");

const UserInfo = sequelize.define(
  "UserInfo",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BIO: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    StudentType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Majors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ImgID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Minor: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    GraduationYear: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Gender: {
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
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "userinfo",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = UserInfo;
