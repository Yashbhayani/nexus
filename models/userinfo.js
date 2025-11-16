const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UserInfo = sequelize.define(
  "UserInfo",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "userinfo",
    timestamps: false,
  }
);

module.exports = UserInfo;
