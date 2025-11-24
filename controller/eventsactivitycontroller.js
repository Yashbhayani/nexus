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

module.exports.get = async (req, res) => {
  let success = false;
  try {
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
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

    if (typeof EventActivityType === "string") {
      try {
        EventActivityType = JSON.parse(EventActivityType);
      } catch (err) {
        return res
          .status(400)
          .json({ success, error: "Invalid EventActivityType format" });
      }
    }

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

    if (!Array.isArray(EventActivityType) || EventActivityType.length === 0) {
      return res.status(400).json({
        success,
        error: "EventActivityType must be a non-empty array",
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

    let Image = await Images.create({
      ImagePath: path,
      UploadedByID: req.user.id,
    });

    if (!Image || !Image.ID) {
      return res.status(500).json({ success, error: "Failed to upload image" });
    }

    let createdEvent = await EventsAndActivities.create({
      OID,
      EventActivityName,
      BuildingID: BID,
      RoomID: RID,
      ImgID: Image.ID,
      StartingTime,
      EndingTime,
      Capacity,
      EventDate,
      Overview,
      EstimatedCostAverage,
      CreatedByID: req.user.id,
    });

    if (!createdEvent || !createdEvent.ID) {
      return res
        .status(500)
        .json({ success, error: "Failed to create event/activity" });
    }

    EventActivityType.forEach(async (type) => {
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
    }

    success = true;
    return res
      .status(200)
      .json({ success, message: "Event created successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};

module.exports.put = async (req, res) => {
  let success = false;
  try {
  
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};
