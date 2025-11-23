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
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
};
