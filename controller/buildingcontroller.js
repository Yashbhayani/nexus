const { request } = require("express");
const { Op } = require("sequelize");
const Building = require("../models/building");
const User = require("../models/user");
const verifyUsers = require("../midlewere/userferification");

module.exports.get = async (req, res) => {
  try {
    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const data = await Building.findAll({
      attributes: ["ID", "Code", "BuildingName"],
      where: { IsDeleted: false },
    });

    success = true;
    res
      .status(200)
      .json({ data, message: "Buildings retrieved successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.post = async (req, res) => {
  try {
    const { Code, BuildingName, Location } = req.body;
    const { path } = req.file;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (!Code || !BuildingName || !Location) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    if (await Building.findOne({ where: { Code } })) {
      return res
        .status(400)
        .json({ error: "Building with this code already exists", success });
    }

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
    res.status(500).json({ error: err.message });
  }
};

module.exports.put = async (req, res) => {
  try {
    const { ID, Code, BuildingName, Location } = req.body;
    const { path } = req.file;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    if (!ID || !Code || !BuildingName || !Location) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    if (await Building.findOne({ where: { Code } })) {
      return res
        .status(400)
        .json({ error: "Building with this code already exists", success });
    }

    let Userdata = await User.findById(req.user.id);
    let success = false;

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

    const building = await Building.findById(ID);

    if (!building) {
      return res.status(404).json({ error: "Building not found", success });
    }

    building.Code = Code;
    building.BuildingName = BuildingName;
    building.Location = Location;
    building.Image = path;

    await building.save();

    success = true;
    res
      .status(200)
      .json({ building, message: "Building updated successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.removebd = async (req, res) => {
  try {
    const { ID } = req.body;
    if (!ID) {
      return res.status(400).json({ error: "ID is required" });
    }

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
