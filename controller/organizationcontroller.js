const { request } = require("express");
const { Op } = require("sequelize");
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
    } = req.body;
    const { path } = req.file;

    if (typeof OrganizationType === "string") {
      try {
        OrganizationType = JSON.parse(OrganizationType); // convert to real array
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "OrganizationType must be a valid JSON array",
        });
      }
    }

    if (
      !OrganizationUserName ||
      !OrganizationName ||
      !OrganizationType ||
      !Email ||
      !Phone ||
      !BID ||
      !RID ||
      !Mission ||
      !path
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success: false,
        message: "OrganizationType must be an array",
      });
    }

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
      Mission: Mission,
      CreatedByID: req.user.id,
    });

    if (!createdOrganizationInfo) {
      return res.status(500).json({
        success: false,
        message: "Failed to create organization info",
      });
    }

    OrganizationType.forEach(async (type) => {
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
    });

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
      OrganizationUserName,
      OrganizationName,
      OrganizationType,
      Email,
      Phone,
      BID,
      RID,
      Mission,
      image,
    } = req.body;
    let path = null;
    if (image) {
      path = req.file;
    }

    if (typeof OrganizationType === "string") {
      try {
        OrganizationType = JSON.parse(OrganizationType); // convert to real array
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "OrganizationType must be a valid JSON array",
        });
      }
    }

    if (
      !ID ||
      !OrganizationUserName ||
      !OrganizationName ||
      !OrganizationType ||
      !Email ||
      !Phone ||
      !BID ||
      !Mission ||
      !RID
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    if (!Array.isArray(OrganizationType)) {
      return res.status(400).json({
        success,
        message: "OrganizationType must be an array",
      });
    }

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
    updatedOrganizationInfo.UpdatedByID = req.user.id;
    await updatedOrganizationInfo.save();

    if (!updatedOrganizationInfo) {
      return res.status(500).json({
        success: false,
        message: "Failed to update organization info",
      });
    }

    OrganizationType.forEach(async (type) => {
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

      //console.log("Similar Status Found: ", SID);

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
    });

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
      return res.status(404).send("Not Found User", success);
    }

    const { OID } = req.query;

    if (!OID) {
      return res.status(400).json({
        success,
        message: "Organization is required",
      });
    }

    if (!(await Organization.findOne({ where: { ID: OID } }))) {
      return res.status(404).json({
        success,
        message: "Organization not found",
      });
    }

    let ManageOrganizations = await ManageOrganization.findOne({
      where: { OID: OID, UID: req.user.id, IsRemove: 0 },
      attributes: ["ID"],
    });

    if (ManageOrganizations) {
      res.status(404).json({
        success,
        message: "User already joined this organization",
      });
    }

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

    ManageOrganizations = await ManageOrganization.create({
      OID: OID,
      UID: req.user.id,
      SID: SID.ID,
    });

    if (!ManageOrganizations) {
      return res.status(500).json({
        success,
        message: "Failed to join organization",
      });
    }

    success = true;
    res.status(200).json({
      message: "You Join Organization Successfully",
      success,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
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
