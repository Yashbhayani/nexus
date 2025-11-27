const { request } = require("express");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const UserType = require("../models/usertype");
const User = require("../models/user");
const StatusType = require("../models/statustype");
const { MasterTypes } = require("../enums/codes");
const Status = require("../models/status");

module.exports.academiclevel = async (req, res) => {
  let success = false;
  try {
    const StatusTypes = await StatusType.findOne({
      where: { Code: MasterTypes.Ad.toUpperCase() },
      attributes: ["ID"],
    });

    if (!StatusTypes) {
      return res.status(404).json({ error: "No record found", success });
    }

    const statusdata = await Status.findAll({
      where: { STID: StatusTypes.ID, IsDeleted: false },
      attributes: ["Code", "Name"],
    });

    if (!statusdata) {
      return res.status(404).json({ error: "No record found", success });
    }
    success = true;
    res.status(200).json({ statusdata, success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.major = async (req, res) => {
  let success = false;
  try {
    const StatusTypes = await StatusType.findOne({
      where: { Code: MasterTypes.Majors.toUpperCase() },
      attributes: ["ID"],
    });

    if (!StatusTypes) {
      return res.status(404).json({ error: "No record found", success });
    }

    const statusdata = await Status.findAll({
      where: { STID: StatusTypes.ID },
      attributes: ["Code", "Name"],
    });

    if (!statusdata) {
      return res.status(404).json({ error: "No record found", success });
    }

    success = true;
    res.status(200).json({ statusdata, success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};
