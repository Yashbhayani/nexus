const UserType = require("../models/usertype");
const User = require("../models/user");
const EnumsCode = require("../enums/codes");

const verifyAdmin = async (req) => {
  let Userdata = await User.findByPk(req.user.id, {
    include: [{ model: UserType, as: "UserType", attributes: ["Code"] }],
    attributes: [],
  });

  if (!Userdata || !Userdata.UserType) {
    return { allowed: false, message: "UserType not found" };
  }

  if (Userdata.UserType.Code !== EnumsCode.ADMIN.toUpperCase()) {
    return { allowed: false, message: "Access denied — not admin" };
  }
  return { allowed: true };
};

const verifyUD = async (req) => {
  let Userdata = await User.findByPk(req.user.id, {
    include: [{ model: UserType, as: "UserType", attributes: ["Code"] }],
    attributes: [],
  });

  if (!Userdata || !Userdata.UserType) {
    return { allowed: false, message: "UserType not found" };
  }

  if (Userdata.UserType.Code !== EnumsCode.UD.toUpperCase()) {
    return { allowed: false, message: "Access denied — not User Admin" };
  }
  return { allowed: true };
};

const verifyEventMagAdmin = async (req) => {
  let Userdata = await User.findByPk(req.user.id, {
    include: [{ model: UserType, as: "UserType", attributes: ["Code"] }],
    attributes: [],
  });

  if (!Userdata || !Userdata.UserType) {
    return { allowed: false, message: "UserType not found" };
  }

  if (Userdata.UserType.Code !== EnumsCode.EventMagAdmin.toUpperCase()) {
    return { allowed: false, message: "Access denied — not EventMagAdmin" };
  }
  return { allowed: true };
};

const verifyEventMagStaff = async (req) => {
  let Userdata = await User.findByPk(req.user.id, {
    include: [{ model: UserType, as: "UserType", attributes: ["Code"] }],
    attributes: [],
  });

  if (!Userdata || !Userdata.UserType) {
    return { allowed: false, message: "UserType not found" };
  }

  if (Userdata.UserType.Code !== EnumsCode.EventMagStaff.toUpperCase()) {
    return { allowed: false, message: "Access denied — not EventMagStaff" };
  }
  return { allowed: true };
};

module.exports = { verifyAdmin, verifyUD, verifyEventMagAdmin, verifyEventMagStaff };
