const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const User = require("../models/user");
const Images = require("../models/images");
const {
  checkAdminStatus,
  CheckOrgMemberStaus,
} = require("../config/findSimilarStatus");
const { Useres } = require("../enums/codes");
const Room = require("../models/rooms");
const Building = require("../models/building");
const EventsAndActivities = require("../models/eventsandactivities");
const ManageEventAndActivities = require("../models/manageeventandactivities");
const e = require("express");
const Organization = require("../models/organization");

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

    const userlogData = await sequelize.query(
      `
        SELECT 
            ea.ID,
            im.ImageURL,
            ea.EventActivityName,
            org.OrganizationName,
            b.BuildingName,
            r.RoomName,

            -- Dec 20 Format
            DATE_FORMAT(ea.EventDate, '%b %d %Y') AS EventDate,

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
            -- RSVP Status TRUE / FALSE
            -- ---------------------------
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM nexus.manageeventandactivities mea 
                    WHERE mea.UID = :UserID
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
        LEFT JOIN nexus.organization As org
          ON org.ID  = ea.OID

        -- Exclude yesterday, only show from TODAY → FUTURE
        WHERE ea.IsDeleted = 0
        AND DATE(ea.EventDate) >= CURDATE() AND ea.ApproverByID IS NOT NULL

        ORDER BY ea.EventDate ASC;


      `,
      {
        replacements: { UserID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    success = true;
    return res.status(200).json({ success, userlogData });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};

module.exports.post = async (req, res) => {
  let success = false;

  try {
    // Fetch logged-in user
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    // Incoming body
    let {
      OID,
      EventActivityName,
      BID,
      RID,
      StartingTime,
      EndingTime,
      Capacity,
      EventDate,
      Overview,
      EstimatedCostAverage,
      EventActivityType,
    } = req.body;

    const { path } = req.file;

    // Required fields
    if (
      !OID ||
      !EventActivityName ||
      !BID ||
      !RID ||
      !StartingTime ||
      !EndingTime ||
      !Capacity ||
      !EventDate ||
      !Overview ||
      !EstimatedCostAverage ||
      !EventActivityType
    ) {
      return res
        .status(400)
        .json({ success, error: "Please fill all required fields" });
    }

    // Validate building & room
    if (!(await Building.findOne({ where: { ID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Building ID",
      });
    }

    if (!(await Room.findOne({ where: { ID: RID, BID: BID } }))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room or Building",
      });
    }

    // -------------------- VALIDATION --------------------

    // TIME validation
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!timeRegex.test(StartingTime) || !timeRegex.test(EndingTime)) {
      return res.status(400).json({
        success: false,
        message: "Time must be HH:MM:SS",
      });
    }

    // EVENT DATE validation (YYYY-MM-DD HH:MM:SS)
    const eventDateRegex =
      /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!eventDateRegex.test(EventDate)) {
      return res.status(400).json({
        success: false,
        message: "EventDate must be YYYY-MM-DD HH:MM:SS",
      });
    }

    // Merge EventDate (date+time) correctly (NO T format)
    const startDT = `${EventDate.split(" ")[0]} ${StartingTime}`;
    const endDT = `${EventDate.split(" ")[0]} ${EndingTime}`;

    const start = new Date(startDT);
    const end = new Date(endDT);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid final datetime (JS cannot parse)",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "EndingTime must be greater than StartingTime",
      });
    }

    // -------------------- CHECK CONFLICT --------------------

    // Check for conflicting event
    const conflictingEvent = await EventsAndActivities.findOne({
      where: {
        BuildingID: BID,
        RoomID: RID,
        EventDate: EventDate.split(" ")[0], // compare by date only

        [Op.or]: [
          {
            StartingTime: { [Op.lt]: endDT },
            EndingTime: { [Op.gt]: startDT },
          },
        ],
      },
    });

    if (conflictingEvent) {
      return res.status(400).json({
        success: false,
        error: "Room not available (time conflict)",
      });
    }

    // -------------------- SAVE IMAGE --------------------
    let Image = await Images.create({
      ImageURL: path,
      UploadedByID: req.user.id,
    });

    if (!Image || !Image.ID) {
      return res.status(500).json({ success, error: "Image upload failed" });
    }

    // -------------------- INSERT EVENT --------------------
    let createdEvent = await EventsAndActivities.create({
      OID,
      EventActivityName,
      EventType: EventActivityType,
      BuildingID: BID,
      RoomID: RID,
      ImgID: Image.ID,
      StartingTime: startDT,
      EndingTime: endDT,
      Capacity,
      EventDate, // already valid MySQL datetime
      Overview,
      EstimatedCostAverage,
      CreatedByID: req.user.id,
    });

    if (!createdEvent) {
      return res
        .status(500)
        .json({ success, error: "Failed to create event/activity" });
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Event created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success, message: error.message });
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
      OID,
      EventActivityName,
      BID,
      RID,
      StartingTime,
      EndingTime,
      Capacity,
      EventDate,
      Overview,
      EstimatedCostAverage,
      EventActivityType,
      image,
    } = req.body;

    let { path } = req.file;
    if (!path) {
      path = null;
    }

    /*if (typeof EventActivityType === "string") {
      try {
        EventActivityType = JSON.parse(EventActivityType); // convert to real array
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "OrganizationType must be a valid JSON array",
        });
      }
    }*/

    if (
      !ID ||
      !OID ||
      !EventActivityName ||
      !BID ||
      !RID ||
      !StartingTime ||
      !EndingTime ||
      !Capacity ||
      !EventDate ||
      !Overview ||
      !EstimatedCostAverage ||
      !EventActivityType
    ) {
      return res
        .status(400)
        .json({ success, error: "Please fill all required fields" });
    }

    /* if (!Array.isArray(EventActivityType) || EventActivityType.length === 0) {
      return res.status(400).json({
        success,
        error: "EventActivityType must be a non-empty array",
      });
    }*/
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

    // -------------------- VALIDATION --------------------

    // TIME validation
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!timeRegex.test(StartingTime) || !timeRegex.test(EndingTime)) {
      return res.status(400).json({
        success: false,
        message: "Time must be HH:MM:SS",
      });
    }

    // EVENT DATE validation (YYYY-MM-DD HH:MM:SS)
    const eventDateRegex =
      /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!eventDateRegex.test(EventDate)) {
      return res.status(400).json({
        success: false,
        message: "EventDate must be YYYY-MM-DD HH:MM:SS",
      });
    }

    // Merge EventDate (date+time) correctly (NO T format)
    const startDT = `${EventDate.split(" ")[0]} ${StartingTime}`;
    const endDT = `${EventDate.split(" ")[0]} ${EndingTime}`;

    const start = new Date(startDT);
    const end = new Date(endDT);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid final datetime (JS cannot parse)",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "EndingTime must be greater than StartingTime",
      });
    }

    // -------------------- CHECK CONFLICT --------------------

    // Check for conflicting event
    const conflictingEvent = await EventsAndActivities.findOne({
      where: {
        BuildingID: BID,
        RoomID: RID,
        EventDate: EventDate.split(" ")[0], // compare by date only

        [Op.or]: [
          {
            StartingTime: { [Op.lt]: endDT },
            EndingTime: { [Op.gt]: startDT },
          },
        ],
      },
    });

    if (conflictingEvent) {
      return res.status(400).json({
        success: false,
        error:
          "Room is not available (conflict or 12-hour buffer rule violated)",
      });
    }

    let updateEvent = await EventsAndActivities.findByPk(ID);
    if (!updateEvent) {
      return res
        .status(404)
        .json({ success, error: "Event/Activity not found" });
    }

    if (path) {
      const UpdateImage = await Images.findOne({
        where: { ID: updateEvent.ImgID },
      });

      if (!UpdateImage) {
        return res.status(404).json({ success, error: "Image not found" });
      }

      UpdateImage.UpdatedByID = req.user.id;
      UpdateImage.IsDeleted = true;
      await UpdateImage.save();

      const NewImage = await Images.create({
        ImageURL: path,
        CreatedByID: req.user.id,
      });

      if (!NewImage || !NewImage.ID) {
        return res
          .status(500)
          .json({ success, error: "Failed to upload image" });
      }

      updateEvent.ImgID = NewImage.ID;
    }

    updateEvent.OID = OID;
    updateEvent.EventActivityName = EventActivityName;
    updateEvent.EventType = EventActivityType;
    updateEvent.BuildingID = BID;
    updateEvent.RoomID = RID;
    updateEvent.StartingTime = StartingTime;
    updateEvent.EndingTime = EndingTime;
    updateEvent.Capacity = Capacity;
    updateEvent.EventDate = EventDate;
    updateEvent.Overview = Overview;
    updateEvent.EstimatedCostAverage = EstimatedCostAverage;
    updateEvent.UpdatedByID = req.user.id;

    /* EventActivityType.forEach(async (type) => {
      let STyID = await StatusType.findOne({
        where: { Code: MasterTypes.Ev.toUpperCase() },
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
    });

    if (
      !(await EventsAndActivitiesType.findOne({
        where: {
          EID: createdEvent.ID,
          SID: SID.ID,
        },
      }))
    ) {
      let createdEventType = await EventsAndActivitiesType.create({
        EID: createdEvent.ID,
        SID: SID.ID,
        CreatedByID: req.user.id,
      });

      if (!createdEventType || !createdEventType.ID) {
        return res
          .status(500)
          .json({ success, error: "Failed to create event/activity type" });
      }
    }*/
    await updateEvent.save();

    if (!updateEvent) {
      return res
        .status(500)
        .json({ success, error: "Failed to update event/activity" });
    }
    success = true;
    return res
      .status(200)
      .json({ success, message: "Event updated successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
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

    const { EID } = req.query;

    if (!EID) {
      return res
        .status(400)
        .json({ success, error: "Please provide Event/Activity ID" });
    }

    const eventCapacitycount = await EventsAndActivities.findOne({
      where: { ID: EID },
      attributes: ["Capacity"],
    });

    if (!eventCapacitycount) {
      return res
        .status(404)
        .json({ success, error: "Event/Activity not found" });
    }

    const count = await ManageEventAndActivities.count({
      where: { EAAID: EID, IsDeleted: false },
    });

    if (count >= eventCapacitycount.Capacity) {
      return res
        .status(400)
        .json({ success, error: "Event/Activity capacity reached" });
    }

    const CheckUserJoinEvent = await ManageEventAndActivities.findOne({
      where: { EAAID: EID, UID: req.user.id, IsDeleted: false },
    });

    if (!CheckUserJoinEvent) {
      const addManageEventAndActivities = await ManageEventAndActivities.create(
        {
          EAAID: EID,
          UID: req.user.id,
          CreatedByID: req.user.id,
        }
      );

      if (!addManageEventAndActivities || !addManageEventAndActivities.ID) {
        return res
          .status(500)
          .json({ success, error: "Failed to join event/activity" });
      }
    } else {
      let updateEventActivities = await ManageEventAndActivities.findByPk(
        CheckUserJoinEvent.ID
      );
      updateEventActivities.IsDeleted = true;
      updateEventActivities.UpdatedByID = req.user.id;

      await updateEventActivities.save();

      if (!updateEventActivities) {
        return res
          .status(500)
          .json({ success, error: "Failed to remove event/activity" });
      }
    }

    success = true;
    return res.status(200).json({ success, message: "Joined successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};

module.exports.deleteevent = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID, OID } = req.query;
    if (!ID) {
      return res
        .status(400)
        .json({ success, error: "Please provide Event/Activity ID" });
    }

    if (!OID) {
      return res
        .status(400)
        .json({ success, error: "Please provide Organization ID" });
    }

    if (
      !(await EventsAndActivities.findOne({
        where: { ID: ID },
      }))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events ID",
      });
    }

    if (
      !(await Organization.findOne({
        where: { ID: OID },
      }))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Organization ID",
      });
    }

    let updateEventActivity = await EventsAndActivities.findByPk(ID);

    if (!updateEventActivity) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events",
      });
    }

    //    console.log(typeof updateEventActivity.OID , typeof OID);
    if (updateEventActivity.OID !== Number(OID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Organization User!",
      });
    }

    let check = await CheckOrgMemberStaus(OID, Userdata.ID);

    if (!check.isMember) {
      let check = await checkAdminStatus(Userdata.ID);
      if (!check.success) {
        return res.status(check.status).json({
          success: false,
          message: check.message,
        });
      }

      if (check.user != Useres.ADMIN.toUpperCase()) {
        return res.status(404).json({ error: "Unauthorized User!", success });
      }
    }

    updateEventActivity.IsDeleted = true;
    updateEventActivity.UpdatedByID = Userdata.ID;
    await updateEventActivity.save();

    if (!updateEventActivity) {
      return res
        .status(500)
        .json({ success, error: "Failed to delete event/activity" });
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Event deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};

module.exports.approved = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }
    const { ID } = req.query;

    if (!ID) {
      return res
        .status(400)
        .json({ success, error: "Please provide Event/Activity ID" });
    }

    let check = await checkAdminStatus(Userdata.ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "Unauthorized User!", success });
    }

    if (
      !(await EventsAndActivities.findOne({
        where: { ID: ID },
      }))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events ID",
      });
    }

    let updateEventActivity = await EventsAndActivities.findByPk(ID);

    if (!updateEventActivity) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events",
      });
    }

    updateEventActivity.ApproverByID = Userdata.ID;
    await updateEventActivity.save();

    if (!updateEventActivity) {
      return res
        .status(500)
        .json({ success, error: "Failed to approver event/activity" });
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Event approved successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success, error: err.message });
  }
};

module.exports.rejected = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }
    const { ID } = req.query;

    if (!ID) {
      return res
        .status(400)
        .json({ success, error: "Please provide Event/Activity ID" });
    }

    let check = await checkAdminStatus(Userdata.ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "Unauthorized User!", success });
    }

    if (
      !(await EventsAndActivities.findOne({
        where: { ID: ID },
      }))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events ID",
      });
    }

    let updateEventActivity = await EventsAndActivities.findByPk(ID);

    if (!updateEventActivity) {
      return res.status(400).json({
        success: false,
        message: "Invalid Events",
      });
    }

    updateEventActivity.Isrejected = true;
    await updateEventActivity.save();

    if (!updateEventActivity) {
      return res
        .status(500)
        .json({ success, error: "Failed to approver event/activity" });
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Event approved successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success, error: err.message });
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
