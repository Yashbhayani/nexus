const sequelize = require("../db");

// Load all models
const User = require("../models/user");
const Status = require("../models/status");
const StatusType = require("../models/statustype");
const Images = require("../models/images");
const Organization = require("../models/organization");
const UserInfo = require("../models/userinfo");
const Comments =  require("../models/comments");

// ADD THESE MODELS ⬇⬇⬇ (you forgot them)
const EventsAndActivities = require("../models/eventsandactivities");
const Building = require("../models/building");
const Room = require("../models/rooms");

// Load associations AFTER all models are imported
require("./associations")({
  User,
  Status,
  StatusType,
  Images,
  Organization,
  UserInfo,
  EventsAndActivities,
  Building,
  Room,
  Comments
});

// Export all models
module.exports = {
  sequelize,
  User,
  Status,
  StatusType,
  Images,
  Organization,
  UserInfo,
  EventsAndActivities,
  Building,
  Room,
  Comments
};
