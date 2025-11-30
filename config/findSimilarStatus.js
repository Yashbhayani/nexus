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

module.exports.CheckOrgMemberStaus = async (OID, UID) => {
  try {
    const orgMemberData = await sequelize.query(
      `
        SELECT 
            CASE 
                WHEN M.ID IS NULL THEN FALSE
                WHEN s.Code = 'ODMember' THEN FALSE
                ELSE TRUE
            END AS Result
        FROM nexus.manageorganization AS M
        LEFT JOIN nexus.status AS s
            ON s.ID = M.SID
        WHERE M.OID = :OID AND M.UID = :UID
        
        UNION ALL
        
        SELECT FALSE
        LIMIT 1;
      `,
      {
        replacements: { OID, UID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    // Extract the boolean result
    const Result = orgMemberData?.[0]?.Result ?? false;

    // if (!Boolean(Result)) {
    //   return {
    //     success: false,
    //     message: "User not found",
    //     status: 404,
    //   };
    // }

    return {
      success: true,
      status: 200,
      isMember: Boolean(Result),
    };
  } catch (error) {
    console.error("CheckOrgMemberStaus Error:", error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};
