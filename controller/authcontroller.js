const { request } = require("express");
const { Op } = require("sequelize");
const User = require("../models/user");
const Staus = require("../models/status");
const UserInfo = require("../models/userinfo");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Images = require("../models/images");
const { Jwt } = require("../credentials");
const nodemailer = require("nodemailer");
const { checkAdminStatus } = require("../config/findSimilarStatus");
const { Useres } = require("../enums/codes");
const OtpTable = require("../models/otptable");

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

    if (MobileNumber.length < 10) {
      success = false;
      return res.status(200).json({
        error:
          "Please enter a valid mobile number in international format (e.g., +14155552671)",
        success,
      });
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(MobileNumber)) {
      // ✅ Global mobile number validation (E.164 format)
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
      return res.status(200).json({ error: "User is Admin", success });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.verifyemail = async (req, res) => {
  let success = false;

  try {
    const { email } = req.query;
    let UserData = await User.findOne({
      where: { Email: email },
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
    });
    if (!UserData) {
      success = false;
      return res.status(200).json({
        error: "Sorry, email is not exists.",
        success,
      });
    }

    let Otpcheck = await OtpTable.count({
      where: {
        UID: UserData.ID,
        IsDeleted: false,
        IsUsed: false,
      },
    });

    if (Otpcheck > 0) {
      let UpdatedOtp = await OtpTable.update(
        {
          IsDeleted: true,
        },
        {
          where: {
            UID: UserData.ID,
            IsDeleted: false,
            IsUsed: false,
          },
        }
      );

      if (!UpdatedOtp) {
        return res.status(500).json({ error: "OTP is not create!", success });
      }
    }

    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "codeground07@gmail.com", // generated ethereal user
        pass: "dvab ldtm jqyg mqib", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "codeground07@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Blog app OTP", // Subject line
      text: OTP, // plain text body
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd;">

          <!-- Header -->
          <div style="background-color: #1E90FF; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0;">Password Recovery Request</h2>
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <p>Hello <strong>${UserData.FirstName} ${UserData.LastName}</strong>,</p>
            <p>We received a request to reset your password. Use the OTP below to complete the process:</p>

            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">${OTP}</h1>
            </div>

            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support.</p>
          </div>

          <!-- Footer -->
          <div style="background-color: #1E90FF; padding: 15px; text-align: center; color: white;">
            <p style="margin: 5px 0; font-size: 14px;">Requested by: <strong>${UserData.FirstName} ${UserData.LastName}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Email: <strong>${UserData.Email}</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>

        </div>

    `,
    });

    let INFOMESSAGE = info.messageId;
    let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);

    let createOtp = await OtpTable.create({
      UID: UserData.ID,
      OTPCode: OTP,
    });

    if (!createOtp) {
      return res.status(500).json({ error: "Failed to create OTP", success });
    }

    success = true;
    return res.status(200).json({
      message: `We've sent a verification code to: ${email}!`,
      success,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.verifyotp = async (req, res) => {
  let success = false;
  try {
    const { email, Otp } = req.body;

    let UserData = await User.findOne({
      where: { Email: email },
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
    });
    if (!UserData) {
      return res.status(200).json({
        error: "Sorry, email is not exists.",
        success,
      });
    }

    let Otpverify = await OtpTable.findOne({
      where: {
        UID: UserData.ID,
        IsDeleted: false,
        IsUsed: false,
      },
    });

    if (!Otpverify) {
      return res.status(200).json({
        error: "Wrong OTp, try again!",
        success,
      });
    }

    // OTP matched → update record

    if (Otpverify.OTPCode !== Otp.trim()) {
      return res.status(200).json({
        error: "Wrong OTp, try again!",
        success,
      });
    }

    let UpdatedOtp = await OtpTable.update(
      {
        IsUsed: true,
      },
      {
        where: {
          ID: Otpverify.ID,
          UID: UserData.ID,
          OTPCode: Otp,
          IsDeleted: false,
          IsUsed: false,
        },
      }
    );

    if (!UpdatedOtp) {
      return res.status(200).json({
        error: "Wrong OTp, try again!",
        success,
      });
    }

    success = true;
    return res.status(200).json({
      message: "Otp Verified Sucessfully!",
      success,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.newpassword = async (req, res) => {
  let success = false;
  try {
    const { email, Password } = req.body;

    let UserData = await User.findOne({
      where: { Email: email },
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
    });
    if (!UserData) {
      return res.status(200).json({
        error: "Sorry, email is not exists.",
        success,
      });
    }

    let UserOTPSucess = await OtpTable.findOne({
      where: {
        UID: UserData.ID,
      },
      order: [["ID", "DESC"]],
    });

    if (UserOTPSucess.IsDeleted) {
      return res.status(404).send("otp is not verified!", success);
    }

    if (!UserOTPSucess.IsUsed) {
      return res.status(404).send("otp is not verified!", success);
    }
    const secPass = await bcrypt.hash(Password, 10);

    UserData = await User.update(
      {
        Password: Password,
      },
      { where: { ID: UserData.ID } }
    );

    if (!UserData) {
      return res
        .status(500)
        .json({ error: "Password is not updated! ", success: false });
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Password Updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.loginData = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    const userlogData = await sequelize.query(
      `
        SELECT 
          u.ID,
          CONCAT(u.FirstName, ' ', u.LastName) AS Name,
          im.ImageURL AS image,
          ut.Name AS SourceTable
        FROM nexus.user AS u
        LEFT JOIN nexus.userinfo AS ui
          ON ui.UID = u.ID
        LEFT JOIN nexus.usertype AS ut
          ON ut.ID = u.UTID  
        LEFT JOIN nexus.images AS im
          ON im.ID = ui.ImgID
        WHERE ui.IsDeleted = 0 
          AND u.ID = :UserID

        UNION ALL 

        SELECT 
          o.ID,
          o.OrganizationName AS Name,
          im.ImageURL AS image,
          'Organization' AS SourceTable
        FROM nexus.organization AS o
        LEFT JOIN nexus.manageorganization AS mo
          ON mo.OID = o.ID
        LEFT JOIN nexus.status AS s
          ON s.ID = mo.SID 
        LEFT JOIN nexus.images AS im
          ON im.ID = o.ImgID
        WHERE mo.UID = :UserID
          AND o.IsDeleted = 0 
          AND s.IsDeleted = 0 
          AND s.Code != 'ODMember';
      `,
      {
        replacements: { UserID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, userlogData });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success, error: err.message });
  }
};
