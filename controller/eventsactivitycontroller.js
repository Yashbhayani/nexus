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
const EventsAndActivities = require("../models/eventsandactivities");
const EventsAndActivitiesType = require("../models/eventsandactivitiestype");
const ManageEventAndActivities = require("../models/manageeventandactivities");
const e = require("express");

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

    return res.status(200).json({ success: true });
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
      Id,
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
    let path = null;
    if (image) {
      path = req.file;
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
      !Id ||
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

    const start = new Date(`${EventDate} ${StartingTime}`);
    const end = new Date(`${EventDate} ${EndingTime}`);

    const isValidTime = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
      StartingTime
    );
    const isValidTime2 = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
      EndingTime
    );

    if (!isValidTime || !isValidTime2) {
      return res.status(400).json({ error: "Invalid TIME format (HH:MM:SS)" });
    }

    // Validate start < end
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: "EndingTime must be greater than StartingTime",
      });
    }

    // Create 12-hour restricted window
    const before12 = new Date(start.getTime() - 12 * 60 * 60 * 1000);
    const after12 = new Date(end.getTime() + 12 * 60 * 60 * 1000);

    // Check for conflicting event
    const conflictingEvent = await EventsAndActivities.findOne({
      where: {
        BuildingID: BID,
        RoomID: RID,
        EventDate: EventDate,

        // Overlap logic:
        // ExistingStart < ProposedEnd AND ExistingEnd > ProposedStart
        [Op.or]: [
          {
            StartingTime: { [Op.lt]: end },
            EndingTime: { [Op.gt]: start },
          },
          // 12 hours before/after restriction
          {
            StartingTime: { [Op.between]: [before12, after12] },
          },
          {
            EndingTime: { [Op.between]: [before12, after12] },
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

    let updateEvent = await EventsAndActivities.findByPk(Id);
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
    if (!event) {
      return res
        .status(404)
        .json({ success, error: "Event/Activity not found" });
    }

    const count = await ManageEventAndActivities.count({
      where: { EAAID: EID },
    });

    if (count >= eventCapacitycount.Capacity) {
      return res
        .status(400)
        .json({ success, error: "Event/Activity capacity reached" });
    }

    const addManageEventAndActivities = await ManageEventAndActivities.create({
      EAAID: EID,
      UID: req.user.id,
      CreatedByID: req.user.id,
    });

    if (!addManageEventAndActivities || !addManageEventAndActivities.ID) {
      return res
        .status(500)
        .json({ success, error: "Failed to join event/activity" });
    }

    success = true;
    return res.status(200).json({ success, message: "Joined successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};
