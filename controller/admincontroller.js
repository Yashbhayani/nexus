const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Useres } = require("../enums/codes");
const BlogTable = require("../models/blogtable");
const EventsAndActivities = require("../models/eventsandactivities");
const Organization = require("../models/organization");
const { checkAdminStatus } = require("../config/findSimilarStatus");
const UserInfo = require("../models/userinfo");
const User = require("../models/user");

module.exports.adminpanel = async (req, res) => {
  let success = false;
  try {
    let ID = req.user.id;
    let check = await checkAdminStatus(ID);

    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "User is not Admin", success });
    }

    const TotalPost = await BlogTable.count({
      where: {
        IsDeleted: false,
      },
    });

    const TotalEvent = await EventsAndActivities.count({
      where: {
        IsDeleted: false,
      },
    });

    const PendingEvent = await EventsAndActivities.count({
      where: {
        ApproverByID: null,
        IsDeleted: false,
      },
    });

    const TotalUsers = await UserInfo.count({
      where: {
        IsDeleted: false,
      },
    });

    const TotalOrganizations = await Organization.count({
      where: {
        IsDeleted: false,
      },
    });

    const TotalAccounts = TotalUsers + TotalOrganizations;

    let TotalData = {
      totalPosts: TotalPost,
      totalEvents: TotalEvent,
      pendingEvents: PendingEvent,
      totalAccounts: TotalAccounts,
      students: TotalUsers,
      organizations: TotalOrganizations,
    };

    success = true;
    return res.status(200).json({ success, TotalData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, error.message);
  }
};

module.exports.getuserorg = async (req, res) => {
  let success = false;
  try {
    let ID = req.user.id;
    let check = await checkAdminStatus(ID);

    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "User is not Admin", success });
    }
    const userandorg = await sequelize.query(
      `
      SELECT 
            u.ID,
            SUBSTRING_INDEX(u.Email, '@', 1) AS UserName,
            CONCAT(u.FirstName, ' ', u.LastName) AS Name,
            im.ImageURL As image,
            u.CreatedByDate As CreatedByDate,
            u.Email As Email,
            (Select Count(*) FROM nexus.blogtable where UID = u.ID) AS TotalPost, 
            ut.Name AS SourceTable
        FROM nexus.user AS u
        LEFT JOIN nexus.userinfo AS ui
            ON ui.UID = u.ID
        LEFT JOIN nexus.usertype AS ut
          ON ut.ID = u.UTID 
        LEFT JOIN nexus.images AS im
            ON im.ID = ui.ImgID
        Where ui.IsDeleted = 0 AND ut.IsDeleted = 0 AND ut.ID !=1

        UNION ALL 

        SELECT 
            o.ID,
            o.OrganizationUserName AS UserName,
            o.OrganizationName AS Name,
            im.ImageURL As image,
            o.CreatedByDate As CreatedByDate,
            oi.email As Email,
            (Select Count(*) FROM nexus.blogtable where OID = o.ID) AS TotalPost,
            'Organization' AS SourceTable
        FROM nexus.organization AS o
        LEFT JOIN nexus.organizationinfo AS oi
          ON oi.OID = o.ID
        LEFT JOIN nexus.images AS im
            ON im.ID = o.ImgID
        Where o.IsDeleted = 0
            
        ORDER BY CreatedByDate DESC;
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    success = true;
    return res.status(200).json({ success, userandorg });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.deleteaccount = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    const { SourceType, ID } = req.body;

    if (!SourceType || !ID) {
      return res.status(400).json({
        success,
        error: "Please fill all required fields",
      });
    }

    let check = await checkAdminStatus(Userdata.ID);

    if (!check.success) {
      return res.status(check.status).json({
        success: success,
        message: check.message,
      });
    }

    if (check.user !== Useres.ADMIN.toUpperCase()) {
      return res.status(401).json({
        success: success,
        message: "Unauthorized User!",
      });
    }

    // -----------------------------------------
    // DELETE STUDENT
    // -----------------------------------------
    if (SourceType === "Student") {
      const student = await User.findOne({ where: { ID } });

      if (!student) {
        return res.status(400).json({
          success: success,
          message: "Invalid Student ID!",
        });
      }

      // Perform delete/update here...

      let UInfo = await UserInfo.update(
        { IsDeleted: true, UpdatedByID: Userdata.ID },
        { where: { UID: ID } }
      );
      if (!UInfo) {
        return res.status(404).json({ success, error: "User not found" });
      }

      success = true;
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }

    // -----------------------------------------
    // DELETE ORGANIZATION
    // -----------------------------------------
    if (SourceType === "Organization") {
      const org = await Organization.findOne({ where: { ID } });
      if (!org) {
        return res.status(400).json({
          success: success,
          message: "Invalid Organization ID!",
        });
      }

      // Perform delete/update here...

      let OInfo = await Organization.update(
        { IsDeleted: true, UpdatedByID: Userdata.ID },
        { where: { ID: ID } }
      );

      if (!OInfo) {
        return res
          .status(404)
          .json({ success, error: "Organization not found" });
      }

      success = true;
      return res.status(200).json({
        success: success,
        message: "Organization deleted successfully",
      });
    }

    // If SourceType is invalid
    return res.status(400).json({
      success: success,
      message: "Invalid SourceType",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports.adminevent = async (req, res) => {
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
    }

    const eventActivities = await sequelize.query(
      `
    SELECT 
        ea.ID,
        im.ImageURL,
        ea.EventActivityName,
        b.BuildingName,
        r.RoomName,
        CASE 
          WHEN ea.ApproverByID IS NULL AND ea.Isrejected = 0 THEN 'Pending'
          WHEN ea.ApproverByID = 1 AND ea.Isrejected = 0 THEN 'Approved'
          WHEN ea.ApproverByID IS NULL AND ea.Isrejected = 1 THEN 'Rejected'
          ELSE 'Unknown'
        END AS Status,
        DATE_FORMAT(ea.EventDate, '%b %d') AS EventDate,
        s.Name,
        ea.Capacity,
        'Organization' AS SourceTable
    FROM nexus.eventsandactivities AS ea
    LEFT JOIN nexus.status AS s
        ON s.ID = ea.EventType
    LEFT JOIN nexus.images AS im
        ON im.ID = ea.ImgID
    LEFT JOIN nexus.building AS b
        ON b.ID = ea.BuildingID
    LEFT JOIN nexus.rooms AS r
        ON r.ID = ea.RoomID
    WHERE ea.IsDeleted = 0
    ORDER BY ea.EventDate DESC;
  `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, eventActivities });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};
