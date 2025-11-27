const { request } = require("express");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const Building = require("../models/building");
const User = require("../models/user");
const verifyUsers = require("../midlewere/userferification");
//const { encryptedData, decrypt } = require("../config/crypto");

module.exports.get = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    let data = await Building.findAll({
      attributes: ["ID", "Code", "BuildingName"],
      where: { IsDeleted: false },
    });

    //data = encryptedData(data);

    success = true;
    res
      .status(200)
      .json({ data, message: "Buildings retrieved successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.post = async (req, res) => {
  let success = false;
  try {
    let { Code, BuildingName, Location } = req.body;
    const { path } = req.file;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (!Code || !BuildingName || !Location || !path) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    if (await Building.findOne({ where: { Code } })) {
      return res
        .status(400)
        .json({ error: "Building with this code already exists", success });
    }

    Code = Code.toUpperCase();

    const newBuilding = await Building.create({
      Code,
      BuildingName,
      Location,
      Image: path,
      IsDeleted: false,
      CreatedByID: req.user.id,
    });

    if (!newBuilding) {
      return res
        .status(500)
        .json({ error: "Failed to create building", success });
    }

    success = true;
    res
      .status(201)
      .json({ newBuilding, message: "Building created successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.put = async (req, res) => {
  let success = false;
  try {
    const { ID, Code, BuildingName, Location, image } = req.body;

    let { path } = req.file;
    if (!path) {
      path = null;
    }
    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    if (!ID || !Code || !BuildingName || !Location) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    // if (await Building.findOne({ where: { Code } })) {
    //   return res
    //     .status(400)
    //     .json({ error: "Building with this code already exists", success });
    // }

    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const verifyCode = await Building.findOne({
      where: { Code: Code, ID: { [Op.ne]: ID } },
    });

    if (verifyCode) {
      return res
        .status(400)
        .json({ error: "Building with this code already exists", success });
    }

    const building = await Building.findByPk(ID);
    if (!building) {
      return res.status(404).json({ error: "Building not found", success });
    }

    building.Code = Code.toUpperCase();
    building.BuildingName = BuildingName;
    building.Location = Location;
    if (path) {
      building.Image = path;
    }
    building.UpdatedByID = req.user.id;
    await building.save();

    success = true;
    res
      .status(200)
      .json({ building, message: "Building updated successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.removebd = async (req, res) => {
  let success = false;
  try {
    const { ID } = req.query;
    if (!ID) {
      return res.status(400).json({ error: "ID is required" });
    }

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    //const decryptID = decrypt(ID);

    const BuildingData = await Building.findByPk(ID);

    if (!BuildingData) {
      return res.status(404).json({ error: "Building not found", success });
    }

    BuildingData.IsDeleted = true;
    await BuildingData.save();
    success = true;
    res.status(200).json({ message: "Building deleted successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};
