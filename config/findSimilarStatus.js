const Levenshtein = require("levenshtein");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const Status = require("../models/status"); // <-- ADD THIS
const User = require("../models/user");

module.exports.findSimilarStatus = async (inputName, STID) => {
  const allStatuses = await Status.findAll({
    where: { STID: STID },
  });

  let bestMatch = null;
  let bestDistance = Infinity;

  for (let s of allStatuses) {
    let dist = new Levenshtein(inputName.toLowerCase(), s.Name.toLowerCase())
      .distance;

    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = s;
    }
  }

  // If similarity is good (distance <= 2), treat as same
  if (bestDistance <= 2) {
    return bestMatch;
  }

  return null;
};

module.exports.CheckUsers = async (ID) => {
  let Userdata = await User.findByPk(ID, {
    attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
    raw: true,
  });

  if (!Userdata) {
    return {
      success: false,
      message: "User not found",
      status: 404,
    };
  }

  return {
    success: true,
    user: Userdata,
  };
};

module.exports.checkAdminStatus = async (ID) => {
  const userData = await sequelize.query(
    `
    SELECT 
      Ut.Code
    FROM nexus.user AS U
    LEFT JOIN nexus.usertype AS Ut
        ON Ut.ID = U.UTID
    WHERE U.ID = :ID
  `,
    {
      replacements: { ID },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  if (!userData) {
    return {
      success: false,
      message: "User not found",
      status: 404,
    };
  }

  const [{ Code }] = userData;

  return {
    success: true,
    user: Code,
  };
};
