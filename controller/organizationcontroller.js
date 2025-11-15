const { request } = require("express");
const UserType = require("../models/usertype");
const User = require("../models/user");
const Organization = require("../models/organization");
const verifyUsers = require("../midlewere/userferification");
const Images = require("../models/images");
const { encryptedData } = require("../config/crypto");

module.exports.get = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findById(req.user.id);
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    let organizations = await Organization.findAll({
      include: [
        {
          model: Images,
          as: "Image",
          attributes: ["ImageUrl"],
        },
      ],
      attributes: ["ID", "OrganizationUserName", "OrganizationName"],
    });
    if (organizations.length === 0) {
      return res.status(404).json({ error: "No organizations found", success });
    }

    organizations = encryptedData(organizations);

    success = true;
    res.status(200).json({ organizations, success });
  } catch (error) {
    res.status(500).json({ error: error.message, success });
  }
};

module.exports.post = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findById(req.user.id);
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { OrganizationUserName, OrganizationName, OrganizationType } =
      req.body;
    const { path } = req.file;

    if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success: false,
        message: "OrganizationType must be an array",
      });
    }

    let createdOrganization = await Organization.create({
      OrganizationUserName,
      OrganizationName,
      OrganizationType,
      CreatedByID: req.user.id,
      IsApproved: true,
    });

    if (!createdOrganization) {
      return res.status(500).json({
        success: false,
        message: "Failed to create organization",
      });
    }

    const Image = await Images.create({
      ImageUrl: path,
      OID: createdOrganization.ID,
      CreatedByID: req.user.id,
    });

    if (!Image) {
      return res.status(500).json({
        success: false,
        message: "Failed to create image",
      });
    }

    createdOrganization.ImgID = Image.ID;
    await createdOrganization.save();

    res
      .status(200)
      .json({ message: "Organization created successfully!", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.put = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findById(req.user.id);
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID, OrganizationUserName, OrganizationName, OrganizationType } =
      req.body;
    const { path } = req.file;

    if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success: false,
        message: "OrganizationType must be an array",
      });
    }

    const updatedOrganization = await Organization.findByPk(ID);


    let createdOrganization = await Organization.create({
      OrganizationUserName,
      OrganizationName,
      OrganizationType,
      CreatedByID: req.user.id,
      IsApproved: true,
    });

    if (!createdOrganization) {
      return res.status(500).json({
        success: false,
        message: "Failed to create organization",
      });
    }

    const Image = await Images.create({
      ImageUrl: path,
      OID: createdOrganization.ID,
      CreatedByID: req.user.id,
    });

    if (!Image) {
      return res.status(500).json({
        success: false,
        message: "Failed to create image",
      });
    }

    createdOrganization.ImgID = Image.ID;
    await createdOrganization.save();

    res
      .status(200)
      .json({ message: "Organization created successfully!", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};
