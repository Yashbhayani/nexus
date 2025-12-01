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

    const { OID } = req.query;

    const orgData = await sequelize.query(
      `
        SELECT 
          o.ID AS OrganizationID,
          o.OrganizationName AS OrganizationName,
          i.ImageURL AS Image,
          s.Name AS OrganizationType,

          -- Total Members
          (SELECT COUNT(*) 
            FROM nexus.manageorganization 
            WHERE OID = o.ID) AS Member,

          -- TRUE/FALSE if user joined
          CASE 
              WHEN EXISTS (
                  SELECT 1 
                  FROM nexus.manageorganization 
                  WHERE OID = o.ID AND UID = :UID
              ) 
              THEN TRUE 
              ELSE FALSE
          END AS IsJoin

        FROM nexus.organization AS o
        LEFT JOIN nexus.organizationinfo AS oi
          ON oi.OID = o.ID
        LEFT JOIN nexus.status AS s
          ON s.ID = o.OrganizationType
        LEFT JOIN nexus.images AS i
          ON i.ID = o.ImgID
        WHERE o.ID = :OID;  
      `,
      {
        replacements: { UID: Userdata.ID, OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const aboutUs = await sequelize.query(
      `
      SELECT 
          oi.AboutUs AS AboutUs,
          oi.Mission AS Mission,
          oi.phone AS Phone,
          oi.email AS Email,

          -- President
          (
              SELECT CONCAT(u.FirstName, ' ', u.LastName)
              FROM nexus.manageorganization mo
              LEFT JOIN nexus.user u ON u.ID = mo.UID
              LEFT JOIN nexus.status s ON s.ID = mo.SID
              WHERE mo.OID = oi.OID 
              AND s.Code = 'ODPRESIDENT'
              LIMIT 1
          ) AS President,

          -- Vice President
          (
              SELECT CONCAT(u.FirstName, ' ', u.LastName)
              FROM nexus.manageorganization mo
              LEFT JOIN nexus.user u ON u.ID = mo.UID
              LEFT JOIN nexus.status s ON s.ID = mo.SID
              WHERE mo.OID = oi.OID 
              AND s.Code = 'ODVICEPRESIDENT'
              LIMIT 1
          ) AS VicePresident

      FROM nexus.organizationinfo AS oi
      WHERE oi.OID = :OID;
      `,
      {
        replacements: { OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const eventData = await sequelize.query(
      `
        SELECT 
            ea.ID,
            im.ImageURL,
            ea.EventActivityName,
            b.BuildingName,
            r.RoomName,

            -- Dec 20 Format
            DATE_FORMAT(ea.EventDate, '%b %d, %Y') AS EventDate,

            s.Name AS EventType,

            -- ---------------------------
            -- Date Category
            -- ---------------------------
            CASE 
                WHEN DATE(ea.EventDate) = CURDATE() THEN 'Today'
                WHEN DATE(ea.EventDate) = CURDATE() + INTERVAL 1 DAY THEN 'Tomorrow'
                WHEN YEARWEEK(ea.EventDate, 1) = YEARWEEK(CURDATE(), 1) THEN 'This Week'
                WHEN MONTH(ea.EventDate) = MONTH(CURDATE()) 
                    AND YEAR(ea.EventDate) = YEAR(CURDATE()) THEN 'This Month'
                ELSE 'Upcoming'
            END AS DateCategory,

            -- ---------------------------
            -- RSVP Count
            -- ---------------------------
            (
                SELECT COUNT(*) 
                FROM nexus.manageeventandactivities mea 
                WHERE mea.EAAID = ea.ID 
                AND mea.IsDeleted = 0
            ) AS Attending,

            -- ---------------------------
            -- RSVP Status TRUE / FALSE
            -- ---------------------------
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM nexus.manageeventandactivities mea 
                    WHERE mea.UID = :UID 
                    AND mea.IsDeleted = 0
                    AND mea.EAAID = ea.ID
                ) 
                THEN TRUE
                ELSE FALSE
            END AS RSVPStatus

          FROM nexus.eventsandactivities AS ea
          LEFT JOIN nexus.status AS s
            ON s.ID = ea.EventType
          LEFT JOIN nexus.images AS im
            ON im.ID = ea.ImgID
          LEFT JOIN nexus.building AS b
            ON b.ID = ea.BuildingID
          LEFT JOIN nexus.rooms AS r
            ON r.ID = ea.RoomID
          LEFT JOIN nexus.organization AS org
            ON org.ID = ea.OID

          -- Only Today → Future
          WHERE ea.IsDeleted = 0 AND ea.OID = :OID
          AND ea.ApproverByID IS NOT NULL

          ORDER BY ea.EventDate ASC;  
      `,
      {
        replacements: { UID: Userdata.ID, OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const post = await sequelize.query(
      `
         SELECT 
                b.ID AS ID,

                -- Name field
                CASE 
                    WHEN u.ID IS NOT NULL THEN 
                        COALESCE(CONCAT(u.FirstName, ' ', u.LastName), SUBSTRING_INDEX(u.Email, '@', 1))
                    WHEN o.ID IS NOT NULL THEN 
                        COALESCE(o.OrganizationName)
                    ELSE 'Unknown'
                END AS Name,

                -- UserName field
                CASE 
                    WHEN u.ID IS NOT NULL THEN SUBSTRING_INDEX(u.Email, '@', 1)
                    WHEN o.ID IS NOT NULL THEN o.OrganizationUserName
                    ELSE NULL
                END AS UserName,

                b.PostTitle,
                b.Content,
                b.Image,

    -- Time ago in human-readable format
    CASE 
        WHEN TIMESTAMPDIFF(HOUR, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
            CONCAT(TIMESTAMPDIFF(HOUR, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' hours ago')
        WHEN TIMESTAMPDIFF(MINUTE, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
            CONCAT(TIMESTAMPDIFF(MINUTE, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' minutes ago')
        ELSE 
            CONCAT(TIMESTAMPDIFF(SECOND, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' seconds ago')
    END AS TimeAgo,
                -- Total Likes of this post
                (SELECT COUNT(*) FROM nexus.like WHERE BID = b.ID) AS Likes,

                -- Total Comments of this post
                (SELECT COUNT(*) FROM nexus.comments WHERE BID = b.ID) AS Comments,

                -- Is user already liked?
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM nexus.like 
                        WHERE BID = b.ID AND UID = :UID 
                    ) 
                    THEN TRUE 
                    ELSE FALSE 
                END AS IsLiked

            FROM nexus.blogtable AS b
            LEFT JOIN nexus.user AS u
                ON u.ID = b.UID 
            LEFT JOIN nexus.organization AS o
                ON o.ID = b.OID 
            Where b.OID = :OID
            ORDER BY b.CreatedDate DESC;  
      `,
      {
        replacements: { UID: Userdata.ID, OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    res.status(200).json({ orgData, aboutUs, eventData, post, success });
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
      return res
        .status(400)
        .json({ success, message: "Organization is required" });
    }

    const Org = await Organization.findOne({ where: { ID: OID } });
    if (!Org) {
      return res
        .status(404)
        .json({ success, message: "Organization not found" });
    }

    // Fetch SID for ODUSER (JOIN STATUS)
    let SID = await Status.findOne({
      where: { Code: OrgDeptTypes.Om.toUpperCase() },
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
