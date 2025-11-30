const { request } = require("express");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const User = require("../models/user");
const Organization = require("../models/organization");
const OrganizationsType = require("../models/organizationtype");
const OrganizationInfo = require("../models/organizationinfo");
const Images = require("../models/images");
const { findSimilarStatus } = require("../config/findSimilarStatus");
//const { encryptedData } = require("../config/crypto");
const Status = require("../models/status");
const StatusType = require("../models/statustype");
const { MasterTypes, OrgDeptTypes } = require("../enums/codes");
const Room = require("../models/rooms");
const Building = require("../models/building");
const ManageOrganization = require("../models/manageorganization");

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

    const { OrganizationName, OrganizationType } = req.query;

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

    //organizations = encryptedData(organizations);

    success = true;
    res.status(200).json({ organizations, success });
  } catch (error) {
    res.status(500).json({ error: error.message, success });
  }
};

module.exports.post = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    let {
      OrganizationUserName,
      OrganizationName,
      OrganizationType,
      Email,
      Phone,
      BID,
      RID,
      Mission,
      AboutUs,
    } = req.body;
    const { path } = req.file;

    /*if (typeof OrganizationType === "string") {
      try {
        OrganizationType = JSON.parse(OrganizationType); // convert to real array
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "OrganizationType must be a valid JSON array",
        });
      }
    }*/

    if (
      !OrganizationUserName ||
      !OrganizationName ||
      !OrganizationType ||
      !Email ||
      !Phone ||
      !BID ||
      !RID ||
      !Mission ||
      !AboutUs ||
      !OrganizationType ||
      !path
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    /*if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success: false,
        message: "OrganizationType must be an array",
      });
    }*/

    if (
      await Organization.findOne({
        where: { OrganizationUserName: OrganizationUserName },
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "OrganizationUserName already exists",
      });
    }

    if (await OrganizationInfo.findOne({ where: { email: Email } })) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in organization info",
      });
    }

    if (await OrganizationInfo.findOne({ where: { phone: Phone } })) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists in organization info",
      });
    }

    if (!(await Building.findOne({ where: { ID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Building ID",
      });
    }

    if (!(await Room.findOne({ where: { ID: RID, BID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID or Building ID",
      });
    }

    const Image = await Images.create({
      ImageURL: path,
      CreatedByID: req.user.id,
    });

    if (!Image) {
      return res.status(500).json({
        success: false,
        message: "Failed to create image",
      });
    }

    let createdOrganization = await Organization.create({
      UID: req.user.id,
      OrganizationUserName,
      OrganizationName,
      ImgID: Image.ID,
      CreatedByID: req.user.id,
      OrganizationType: OrganizationType,
      IsApproved: true,
    });

    if (!createdOrganization) {
      return res.status(500).json({
        success: false,
        message: "Failed to create organization",
      });
    }

    let createdOrganizationInfo = await OrganizationInfo.create({
      OID: createdOrganization.ID,
      email: Email,
      phone: Phone,
      BID: BID,
      RID: RID,
      AboutUs: AboutUs,
      Mission: Mission,
      CreatedByID: req.user.id,
    });

    if (!createdOrganizationInfo) {
      return res.status(500).json({
        success: false,
        message: "Failed to create organization info",
      });
    }

    /*OrganizationType.forEach(async (type) => {
      let STyID = await StatusType.findOne({
        where: { Code: MasterTypes.Or.toUpperCase() },
        attributes: ["ID"],
      });

      let similar = await findSimilarStatus(type, STyID.ID);
      let SID = null;
      if (similar) {
        SID = similar;
      } else {
        SID = await Status.findOne({
          where: {
            STID: STyID.ID,
            Code: type.trim().replace(/\s+/g, "").toUpperCase(),
          },
          attributes: ["ID"],
        });
      }

      if (!SID) {
        let CreatedStatus = await Status.create({
          STID: STyID.ID,
          Code: type.trim().replace(/\s+/g, "").toUpperCase(),
          Name: type
            .trim()
            .replace(/\s+/g, "")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          CreatedByID: req.user.id,
        });

        if (!CreatedStatus) {
          return res.status(500).json({
            success: false,
            message: "Failed to create status type",
          });
        }

        SID = CreatedStatus;
      }

      // Additional logic can be added here if needed
      //createdOrganization.ID
      if (
        !(await OrganizationsType.findOne({
          where: { OID: createdOrganization.ID, SID: SID.ID },
        }))
      ) {
        let createdOrganizationType = await OrganizationsType.create({
          SID: SID.ID,
          OID: createdOrganization.ID,
          CreatedByID: req.user.id,
        });
        if (!createdOrganizationType) {
          return res.status(500).json({
            success: false,
            message: "Failed to create organization type",
          });
        }
      }
    });*/

    success = true;
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
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    let {
      ID,
      OrganizationName,
      OrganizationType,
      Email,
      Phone,
      Mission,
      AboutUs,
      image,
    } = req.body;

    let { path } = req.file;
    if (!path) {
      path = null;
    }

    /*if (typeof OrganizationType === "string") {
      try {
        OrganizationType = JSON.parse(OrganizationType); // convert to real array
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "OrganizationType must be a valid JSON array",
        });
      }
    }*/

    if (
      !ID ||
      !OrganizationName ||
      !OrganizationType ||
      !Email ||
      !Phone ||
      !BID ||
      !Mission ||
      !AboutUs ||
      !RID
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    /*if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success,
        message: "OrganizationType must be an array",
      });
    }*/

    if (
      await Organization.findOne({
        where: {
          OrganizationUserName: OrganizationUserName,
          ID: { [Op.ne]: ID },
        },
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "OrganizationUserName already exists",
      });
    }

    if (
      await OrganizationInfo.findOne({
        where: { email: Email, OID: { [Op.ne]: ID } },
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in organization info",
      });
    }

    if (
      await OrganizationInfo.findOne({
        where: { phone: Phone, OID: { [Op.ne]: ID } },
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists in organization info",
      });
    }

    if (!(await Building.findOne({ where: { ID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Building ID",
      });
    }

    if (!(await Room.findOne({ where: { ID: RID, BID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID or Building ID",
      });
    }

    let updatedOrganization = await Organization.findByPk(ID);

    if (!updatedOrganization) {
      return res
        .status(400)
        .json({ message: "Organization not found", success });
    }

    if (path) {
      const UopdatedImage = await Images.findOne({
        where: { ID: updatedOrganization.ImgID },
      });

      if (!UopdatedImage) {
        res.status(200).json({
          success: false,
          message: "Image not found",
        });
      }
      UopdatedImage.UpdatedByID = req.user.id;
      UopdatedImage.IsDeleted = true;
      await UopdatedImage.save();

      const Image = await Images.create({
        ImageUrl: path,
        OID: updatedOrganization.ID,
        CreatedByID: req.user.id,
      });

      if (!Image) {
        return res.status(500).json({
          success: false,
          message: "Failed to create image",
        });
      }
      updatedOrganization.ImgID = Image.ID;
    }

    updatedOrganization.OrganizationUserName = OrganizationUserName;
    updatedOrganization.OrganizationName = OrganizationName;
    updatedOrganization.UpdatedByID = req.user.id;
    updatedOrganization.save();

    if (!updatedOrganization) {
      return res.status(400).json({
        success: false,
        message: "Failed to update organization",
      });
    }

    let updatedOrganizationInfo = await OrganizationInfo.findOne({
      where: { OID: updatedOrganization.ID },
    });

    updatedOrganizationInfo.email = Email;
    updatedOrganizationInfo.phone = Phone;
    updatedOrganizationInfo.BID = BID;
    updatedOrganizationInfo.RID = RID;
    updatedOrganizationInfo.Mission = Mission;
    updatedOrganizationInfo.AboutUs = AboutUs;
    updatedOrganizationInfo.UpdatedByID = req.user.id;
    await updatedOrganizationInfo.save();

    if (!updatedOrganizationInfo) {
      return res.status(500).json({
        success: false,
        message: "Failed to update organization info",
      });
    }

    /*OrganizationType.forEach(async (type) => {
      let STyID = await StatusType.findOne({
        where: { Code: MasterTypes.Or.toUpperCase() },
        attributes: ["ID"],
      });

      let similar = await findSimilarStatus(type, STyID.ID);
      let SID = null;
      if (similar) {
        SID = similar;
      } else {
        SID = await Status.findOne({
          where: {
            STID: STyID.ID,
            Code: type.trim().replace(/\s+/g, "").toUpperCase(),
          },
          attributes: ["ID"],
        });
      }

11
      if (!SID) {
        let CreatedStatus = await Status.create({
          STID: STyID.ID,
          Code: type.trim().replace(/\s+/g, "").toUpperCase(),
          Name: type
            .trim()
            .replace(/\s+/g, "")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          CreatedByID: req.user.id,
        });

        if (!CreatedStatus) {
          return res.status(500).json({
            success: false,
            message: "Failed to create status type",
          });
        }

        SID = CreatedStatus;
      }

      // Additional logic can be added here if needed
      if (
        !(await OrganizationsType.findOne({
          where: { OID: updatedOrganization.ID, SID: SID.ID },
        }))
      ) {
        let createdOrganizationType = await OrganizationsType.create({
          SID: SID.ID,
          OID: updatedOrganization.ID,
          CreatedByID: req.user.id,
        });
        if (!createdOrganizationType) {
          return res.status(500).json({
            success: false,
            message: "Failed to create organization type",
          });
        }
      }
    });*/

    success = true;
    res
      .status(200)
      .json({ message: "Organization updated successfully!", success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.join = async (req, res) => {
  let success = false;

  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "Not Found User" });
    }

    const { OID } = req.query;

    if (!OID) {
      return res.status(400).json({ success, message: "Organization is required" });
    }

    const Org = await Organization.findOne({ where: { ID: OID } });
    if (!Org) {
      return res.status(404).json({ success, message: "Organization not found" });
    }

    // Fetch SID for ODUSER (JOIN STATUS)
    let SID = await Status.findOne({
      where: { Code: OrgDeptTypes.OdU.toUpperCase() },
      attributes: ["ID"],
    });

    if (!SID) {
      return res.status(404).json({
        success,
        message: "Organization department type not found",
      });
    }

    const existing = await ManageOrganization.findOne({
      where: { OID: OID, UID: Userdata.ID },
    });

    // ➤ CASE 1: User currently joined → Remove (IsRemove = true)
    if (existing && !Boolean(existing.IsRemove)) {
      await ManageOrganization.update(
        { IsRemove: true },
        { where: { OID: OID, UID: Userdata.ID } }
      );

      success = true;
      return res.status(200).json({
        success,
        message: "You removed from this organization successfully!",
      });
    }

    // ➤ CASE 2: User exists but removed → Re-Join (IsRemove = false)
    if (existing && Boolean(existing.IsRemove)) {
      await ManageOrganization.update(
        { IsRemove: false },
        { where: { OID: OID, UID: Userdata.ID } }
      );

      success = true;
      return res.status(200).json({
        success,
        message: "You rejoined organization successfully!",
      });
    }

    // ➤ CASE 3: User never joined → Insert new record
    await ManageOrganization.create({
      OID: OID,
      UID: Userdata.ID,
      SID: SID.ID,
      IsRemove: false,
    });

    success = true;
    return res.status(200).json({
      success,
      message: "You joined organization successfully!",
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success, error: err.message });
  }
};


module.exports.vieworganization = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { OID } = req.body;

    if (!OID) {
      return res.status(400).json({
        success,
        message: "Organization is required",
      });
    }

    let organization = await Organization.findOne({ where: { ID: OID } });

    if (!organization) {
      return res.status(404).json({
        success,
        message: "Organization not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success });
  }
};
