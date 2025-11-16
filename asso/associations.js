module.exports = ({
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
}) => {
  // Organization → User
  Organization.belongsTo(User, { foreignKey: "ApproverByID", as: "Approver" });
  Organization.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
  Organization.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

  // Organization → Status
  Organization.belongsTo(Status, {
    foreignKey: "OrganizationType",
    as: "Type",
  });

  // Organization → Images
  Organization.belongsTo(Images, { foreignKey: "ImgID", as: "Image" });

  Room.belongsTo(Building, { foreignKey: "BID", as: "Building" });
  Room.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
  Room.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

  // 🔗 Associations
  EventsAndActivities.belongsTo(User, { foreignKey: "UID", as: "User" });
  EventsAndActivities.belongsTo(Organization, {
    foreignKey: "OID",
    as: "Organization",
  });

  EventsAndActivities.belongsTo(User, {
    foreignKey: "ApproverByID",
    as: "Approver",
  });
  EventsAndActivities.belongsTo(User, {
    foreignKey: "CreatedByID",
    as: "CreatedBy",
  });
  EventsAndActivities.belongsTo(User, {
    foreignKey: "UpdatedByID",
    as: "UpdatedBy",
  });

  EventsAndActivities.belongsTo(Status, {
    foreignKey: "EventActivityStatusType",
    as: "StatusType",
  });
  EventsAndActivities.belongsTo(Status, {
    foreignKey: "EventActivityType",
    as: "ActivityType",
  });

  EventsAndActivities.belongsTo(Building, {
    foreignKey: "BuildingID",
    as: "Building",
  });
  EventsAndActivities.belongsTo(Room, { foreignKey: "RoomID", as: "Room" });

  EventsAndActivities.belongsTo(Images, { foreignKey: "ImgID", as: "Image" });

  // 🔗 Associations
  Building.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
  Building.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

  Comments.belongsTo(EventsAndActivities, {
    foreignKey: "EAAID",
    as: "EventActivity",
  });
  Comments.belongsTo(User, { foreignKey: "UID", as: "User" });
  Comments.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
  Comments.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });

  // 🧩 Self-referencing relationship for threaded comments
  Comments.belongsTo(Comments, {
    foreignKey: "ParentCommentID",
    as: "ParentComment",
    onDelete: "CASCADE",
  });
  Comments.hasMany(Comments, { foreignKey: "ParentCommentID", as: "Replies" });

  // UserInfo → User
  UserInfo.belongsTo(User, { foreignKey: "UID", as: "User" });

  // UserInfo → StatusType
  UserInfo.belongsTo(StatusType, {
    foreignKey: "StudentType",
    as: "StudentTypeInfo",
  });

  // UserInfo → Status
  UserInfo.belongsTo(Status, { foreignKey: "Majors", as: "MajorStatus" });
  UserInfo.belongsTo(Status, { foreignKey: "Gender", as: "GenderStatus" });

  // UserInfo → Images
  UserInfo.belongsTo(Images, { foreignKey: "ImgID", as: "ProfileImage" });

  // UserInfo → User (Audit)
  UserInfo.belongsTo(User, { foreignKey: "CreatedByID", as: "CreatedBy" });
  UserInfo.belongsTo(User, { foreignKey: "UpdatedByID", as: "UpdatedBy" });
};
