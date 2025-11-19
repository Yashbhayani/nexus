// models/index.js or asso/main.js
const User = require("../models/user");
const UserInfo = require("../models/userinfo");
const Status = require("../models/status");
const Images = require("../models/images");
const Organization = require("../models/organization");
const EventsAndActivities = require("../models/eventsandactivities");
const ThirdPartyHandleApi = require("../models/thirdpartyhandleapi");
const StatusType = require("../models/statustype");
const OrganizationType = require("../models/organizationtype");
const Room = require("../models/rooms");
const OrganizationInfo = require("../models/organizationinfo");
const ManageHashtags = require("../models/managehashtags");
const ManageEventAndActivities = require("../models/manageeventandactivities");
const Like = require("../models/like");
const Hashtags = require("../models/hashtags");
const Followers = require("../models/followers");
const Feedback = require("../models/feedback");
const Comments = require("../models/comments");
const Building = require("../models/building");
const BlogTable = require("../models/blogtable");
const SkillsTable = require("../models/skillstable");
const InterestTable = require("../models/interesttable");
const UserType = require("../models/usertype");

// ... all other models

// 🔹 Associations

// -------------------------------------------------
// ⭐ ASSOCIATIONS
// -------------------------------------------------

StatusType.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

StatusType.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Belongs to StatusType
Status.belongsTo(StatusType, {
  foreignKey: "STID",
  as: "StatusType",
});

// Created By User
Status.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Status.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// ---------------------------------------------------------
// ⭐ ASSOCIATIONS
// ---------------------------------------------------------

// Room belongs to Building
Room.belongsTo(Building, {
  foreignKey: "BID",
  as: "Building",
});

// Created By User
Room.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Room.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// (Optional) UserType has many Users
UserType.hasMany(User, { foreignKey: "UTID", as: "Users" });

UserInfo.belongsTo(User, { foreignKey: "UID", as: "User" });
UserInfo.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
UserInfo.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

UserInfo.belongsTo(Status, { foreignKey: "Gender", as: "GenderStatus" });
UserInfo.belongsTo(Status, { foreignKey: "Majors", as: "MajorStatus" });
UserInfo.belongsTo(Status, {
  foreignKey: "StudentType",
  as: "StudentTypeInfo",
});

UserInfo.belongsTo(Images, { foreignKey: "ImgID", as: "Image" });

// Organization associations
Organization.belongsTo(User, {
  foreignKey: "UID",
  as: "Owner",
});
Organization.belongsTo(Images, { foreignKey: "ImgID", as: "Image" });
Organization.belongsTo(User, { foreignKey: "ApproverByID", as: "Approver" });
Organization.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
Organization.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });
Organization.belongsTo(Status, {
  foreignKey: "OrganizationType",
  as: "OrganizationTypeStatus",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// OrganizationType belongs to Status
OrganizationType.belongsTo(Status, {
  foreignKey: "SID",
  as: "Status",
});

// OrganizationType belongs to Organization
OrganizationType.belongsTo(Organization, {
  foreignKey: "OID",
  as: "Organization",
});

// Created By User
OrganizationType.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Updated By User
OrganizationType.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// OrganizationInfo belongs to Organization
OrganizationInfo.belongsTo(Organization, {
  foreignKey: "OID",
  as: "Organization",
});

// OrganizationInfo → Building
OrganizationInfo.belongsTo(Building, {
  foreignKey: "BID",
  as: "Building",
});

// OrganizationInfo → Room
OrganizationInfo.belongsTo(Room, {
  foreignKey: "RID",
  as: "Room",
});

// Created By User
OrganizationInfo.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
OrganizationInfo.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// 🔗 Associations
ManageHashtags.belongsTo(Hashtags, { foreignKey: "HashtagID", as: "Hashtag" });
ManageHashtags.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
ManageHashtags.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Event
ManageEventAndActivities.belongsTo(EventsAndActivities, {
  foreignKey: "EAAID",
  as: "Event",
});

// User
ManageEventAndActivities.belongsTo(User, {
  foreignKey: "UID",
  as: "User",
});

// Status
ManageEventAndActivities.belongsTo(Status, {
  foreignKey: "StatusID",
  as: "Status",
});

// Created By User
ManageEventAndActivities.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
ManageEventAndActivities.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Event
Like.belongsTo(EventsAndActivities, {
  foreignKey: "EAAID",
  as: "Event",
});

// User
Like.belongsTo(User, {
  foreignKey: "UID",
  as: "User",
});

// Created By User
Like.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Like.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Created By User
Hashtags.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Hashtags.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Follower User
Followers.belongsTo(User, {
  foreignKey: "FollowerID",
  as: "Follower",
});

// Following User
Followers.belongsTo(User, {
  foreignKey: "FollowingID",
  as: "Following",
});

// Created By User
Followers.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Followers.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Event
Feedback.belongsTo(EventsAndActivities, {
  foreignKey: "EAAID",
  as: "Event",
});

// User
Feedback.belongsTo(User, {
  foreignKey: "UID",
  as: "User",
});

// Response → Status
Feedback.belongsTo(Status, {
  foreignKey: "Response",
  as: "ResponseStatus",
});

// Created By User
Feedback.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Feedback.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Event
Comments.belongsTo(EventsAndActivities, {
  foreignKey: "EAAID",
  as: "Event",
});

// User
Comments.belongsTo(User, {
  foreignKey: "UID",
  as: "User",
});

// Parent Comment (self-referencing)
Comments.belongsTo(Comments, {
  foreignKey: "ParentCommentID",
  as: "ParentComment",
});

// Child Comments (hasMany self-reference)
Comments.hasMany(Comments, {
  foreignKey: "ParentCommentID",
  as: "Replies",
});

// Created By User
Comments.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Comments.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Created By User
Building.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Building.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Author / User
BlogTable.belongsTo(User, {
  foreignKey: "UID",
  as: "Author",
});

// Created By User
BlogTable.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
BlogTable.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// Category (Status)
BlogTable.belongsTo(Status, {
  foreignKey: "CategoryID",
  as: "Category",
});

// --------------------------------------------------------
// ⭐ EventsAndActivities
// --------------------------------------------------------

// Organization
EventsAndActivities.belongsTo(Organization, {
  foreignKey: "OID",
  as: "Organization",
});

// Building
EventsAndActivities.belongsTo(Building, {
  foreignKey: "BuildingID",
  as: "Building",
});

// Room
EventsAndActivities.belongsTo(Room, {
  foreignKey: "RoomID",
  as: "Room",
});

// Image
EventsAndActivities.belongsTo(Images, {
  foreignKey: "ImgID",
  as: "Image",
});

// Approver
EventsAndActivities.belongsTo(User, {
  foreignKey: "ApproverByID",
  as: "Approver",
});

// Status Type
EventsAndActivities.belongsTo(Status, {
  foreignKey: "EventActivityStatusType",
  as: "StatusType",
});

// Event Type
EventsAndActivities.belongsTo(Status, {
  foreignKey: "EventActivityType",
  as: "EventType",
});

// Created By User
EventsAndActivities.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
EventsAndActivities.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------------------

// Created By User
Images.belongsTo(User, {
  foreignKey: "CreatedByID",
  as: "CreatedBy",
});

// Updated By User
Images.belongsTo(User, {
  foreignKey: "UpdatedByID",
  as: "UpdatedBy",
});

// --------------------------------------------
// ⭐ ASSOCIATIONS
// --------------------------------------------

// Created By User
ThirdPartyHandleApi.belongsTo(User, {
  foreignKey: "CreatedID",
  as: "CreatedBy",
});

// Updated By User
ThirdPartyHandleApi.belongsTo(User, {
  foreignKey: "UpdatedID",
  as: "UpdatedBy",
});

SkillsTable.belongsTo(User, { foreignKey: "UID", as: "User" });
SkillsTable.belongsTo(Status, { foreignKey: "SID", as: "SkillStatus" });

// Associations
InterestTable.belongsTo(User, { foreignKey: "UID", as: "User" });
InterestTable.belongsTo(Status, { foreignKey: "SID", as: "InterestStatus" });

module.exports = {
  User,
  UserType,
  UserInfo,
  Status,
  Images,
  Organization,
  EventsAndActivities,
  ThirdPartyHandleApi,
  StatusType,
  OrganizationType,
  Room,
  OrganizationInfo,
  ManageHashtags,
  ManageEventAndActivities,
  Like,
  Hashtags,
  Followers,
  Feedback,
  Comments,
  Building,
  BlogTable,
  SkillsTable,
  InterestTable,
};
