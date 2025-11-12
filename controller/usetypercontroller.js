const { request } = require("express");
const UserType = require("../models/usertype");
const User = require("../models/user");
const verifyUsers = require("../midlewere/userferification");

module.exports.get = async (req, res) => {
  try {
    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }
    const data = await UserType.findAll({
      attributes: ["ID", "Code", "Name"],
      where: { IsDeleted: false },
    });
    success = true;
    res
      .status(200)
      .json({ data, message: "User types retrieved successfully", success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user type
module.exports.post = async (req, res) => {
  try {
    const { Code, Name } = req.body;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (await UserType.findOne({ where: { Code } })) {
      return res
        .status(400)
        .json({ error: "UserType with this code already exists" });
    }
    const newUserType = await UserType.create({ Code, Name });

    if (!newUserType) {
      return res.status(500).json({ error: "Failed to create user type" });
    }

    success = true;

    res.json({
      message: "UserType created successfully",
      data: newType,
      success,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.put = async (req, res) => {
  try {
    const { Id, Code, Name } = req.body;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }

    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (!Code || !Name) {
      return res.status(400).json({ error: "Please enter all the fields" });
    }

    const userType = await UserType.findOne({ where: { Code } });

    if (userType) {
      return res.status(404).json({ error: "UserType Code is Already Taken" });
    }

    const userTypeToUpdate = await UserType.findOne({ where: { ID: Id } });
    userTypeToUpdate.Code = Code;
    userTypeToUpdate.Name = Name;
    await userTypeToUpdate.save();

    success = true;
    res.json({
      message: "UserType updated successfully",
      data: userType,
      success,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.removeut = async (req, res) => {
  try {
    const { Id } = req.body;

    const adminCheck = await verifyUsers.verifyAdmin(req);
    if (!adminCheck.allowed) {
      return res.status(403).json({ error: adminCheck.message });
    }
    
    let Userdata = await User.findById(req.user.id);
    let success = false;

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }
    if (!Id) {
      return res.status(400).json({ error: "Please provide an Id", success });
    }

    const userType = await UserType.findOne({ where: { ID: Id } });
    userType.IsDeleted = true;
    await userType.save();

    success = true;
    res.json({
      message: "UserType deleted successfully",
      data: userType,
      success,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
