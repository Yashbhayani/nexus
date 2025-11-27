const { request } = require("express");
const User = require("../models/user");
const Staus = require("../models/status");
const UserInfo = require("../models/userinfo");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Images = require("../models/images");
const { Jwt } = require("../credentials");
const { checkAdminStatus } = require("../config/findSimilarStatus");
const { Useres } = require("../enums/codes");

module.exports.login = async (req, res) => {
  let success = false;
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res
        .status(200)
        .json({ error: "Please enter all the fields", success });
    }

    // Fetch password too for comparison
    const Userdata = await User.findOne({
      attributes: [
        "ID",
        "FirstName",
        "LastName",
        "MobileNumber",
        "Email",
        "Password",
      ],
      where: { Email },
    });

    if (!Userdata) {
      return res
        .status(404)
        .json({ error: "Your account is not found", success });
    }

    // Compare password properly (case-sensitive key)
    const passwordCompare = await bcrypt.compare(Password, Userdata.Password);
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Please try to login with correct credentials.",
        success,
      });
    }

    const data = {
      user: {
        id: Userdata.ID,
        email: Userdata.Email,
        mobile: Userdata.MobileNumber,
        name: `${Userdata.FirstName} ${Userdata.LastName}`,
      },
    };

    const authToken = jwt.sign(data, Jwt.JWT_SCERET || "NexusCampus");
    success = true;
    return res
      .status(200)
      .json({ success, authToken, message: "Login successful" });
  } catch (e) {
    return res.status(500).json({ error: e.message, success });
  }
};

module.exports.createaccount = async (req, res) => {
  let success = false;
  try {
    const {
      FirstName,
      LastName,
      MobileNumber,
      Email,
      Password,
      StudentType,
      Majors,
    } = req.body;

    // Check required fields
    if (
      !FirstName ||
      !LastName ||
      !MobileNumber ||
      !Email ||
      !Password ||
      !StudentType ||
      !Majors
    ) {
      success = false;
      return res
        .status(200)
        .json({ error: "Please enter all the fields", success });
    }

    // Email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(Email)) {
      success = false;
      return res
        .status(200)
        .json({ error: "Please enter a valid email", success });
    }

    // ✅ Global mobile number validation (E.164 format)
    if (!/^\+?[1-9]\d{1,14}$/.test(MobileNumber)) {
      success = false;
      return res.status(200).json({
        error:
          "Please enter a valid mobile number in international format (e.g., +14155552671)",
        success,
      });
    }

    // Password validation (combined)
    let errors = [];

    if (Password.length < 6) {
      errors.push("at least 6 characters");
    }
    if (!/\d/.test(Password)) {
      errors.push("at least one number");
    }
    if (!/[A-Z]/.test(Password)) {
      errors.push("at least one uppercase letter");
    }
    if (!/[a-z]/.test(Password)) {
      errors.push("at least one lowercase letter");
    }
    if (!/[@#$%^&*]/.test(Password)) {
      errors.push("at least one special character (@, #, $, %, ^, &, *)");
    }
    if (/\s/.test(Password)) {
      errors.push("no spaces allowed");
    }

    if (errors.length > 0) {
      success = false;
      return res.status(200).json({
        error: "Password must contain " + errors.join(", "),
        success,
      });
    }

    if (await User.findOne({ where: { Email } })) {
      success = false;
      return res.status(200).json({
        error: "Sorry a user with this email already exists.",
        success,
      });
    }

    if (await User.findOne({ where: { MobileNumber } })) {
      success = false;
      return res.status(200).json({
        error: "Sorry a user with this mobile number already exists.",
        success,
      });
    }

    const secPass = await bcrypt.hash(req.body.Password, 10);

    let UserData = await User.create({
      FirstName: FirstName,
      LastName: LastName,
      MobileNumber: MobileNumber,
      Email: Email,
      Password: secPass,
    });

    let STID = await Staus.findOne({
      attributes: ["ID"],
      where: { Code: StudentType.toUpperCase() },
    });
    let MID = await Staus.findOne({
      attributes: ["ID"],
      where: { Code: Majors.toUpperCase() },
    });

    if (!STID || !MID) {
      return res
        .status(500)
        .json({ error: "Invalid StudentType or Majors", success: false });
    }

    let UInfo = await UserInfo.create({
      UID: UserData.ID,
      StudentType: STID.ID,
      Majors: MID.ID,
    });

    if (!UInfo) {
      return res
        .status(500)
        .json({ error: "Failed to create user info", success: false });
    }

    const data = {
      user: {
        id: UserData.ID,
        email: UserData.Email,
        mobile: UserData.MobileNumber,
        name: `${UserData.FirstName} ${UserData.LastName}`,
      },
    };

    // ✅ All validations passed
    success = true;
    const authToken = jwt.sign(data, Jwt.JWT_SCERET || "NexusCampus");
    return res
      .status(200)
      .json({ success, authToken, message: "User registered successfully" });
  } catch (e) {
    return res.status(500).json({ error: e.message, success: false });
  }
};

module.exports.userinfo = async (req, res) => {
  let success = false;
  try {
    const { BIO, Gender, Minor, GraduationYear } = req.body;
    const { path } = req.file;

    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    if (!BIO || !Gender || !Minor || !GraduationYear) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    let GID = await Staus.findOne({
      attributes: ["ID"],
      where: { IsDeleted: false, Code: Gender.toUpperCase() },
    });

    if (!GID) {
      return res
        .status(400)
        .json({ error: "Please enter a valid gender", success });
    }

    let ImagesData = await Images.create({
      ImageURL: path,
      CreatedByID: Userdata.ID,
    });

    if (!ImagesData) {
      return res
        .status(500)
        .json({ error: "Failed to upload image", success: false });
    }

    let UInfo = await UserInfo.update(
      {
        BIO: BIO,
        Gender: GID.ID,
        ImgID: ImagesData.ID,
        Minor: Minor,
        GraduationYear: GraduationYear,
      },
      { where: { UID: Userdata.ID } }
    );

    if (!UInfo) {
      return res
        .status(500)
        .json({ error: "Failed to update user info", success: false });
    }

    res.json({
      success: true,
      message: "User info updated successfully",
    });
  } catch (e) {
    return res.status(500).json({ error: e.message, success: false });
  }
};

module.exports.verifyusertype = async (req, res) => {
  let success = false;
  try {
    let ID = req.user.id;

    // Call the function
    let check = await checkAdminStatus(ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "User is not Admin", success });
    } else {
      success = true;
      return res.status(404).json({ error: "User is Admin", success });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};
