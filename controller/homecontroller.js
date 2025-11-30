const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Useres } = require("../enums/codes");
const BlogTable = require("../models/blogtable");
const EventsAndActivities = require("../models/eventsandactivities");
const Organization = require("../models/organization");
const { checkAdminStatus } = require("../config/findSimilarStatus");
const UserInfo = require("../models/userinfo");
const User = require("../models/user");

module.exports.feed = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const Blogsfeeds = await sequelize.query(
      `
            SELECT 
                b.ID AS ID,

                -- Name field
                CASE 
                    WHEN u.ID IS NOT NULL THEN 
                        COALESCE(CONCAT(u.FirstName, ' ', u.LastName), SUBSTRING_INDEX(u.Email, '@', 1))
                    WHEN o.ID IS NOT NULL THEN 
                        COALESCE(o.OrganizationName)
                    ELSE 'Unknown'
                END AS Name,

                -- UserName field
                CASE 
                    WHEN u.ID IS NOT NULL THEN SUBSTRING_INDEX(u.Email, '@', 1)
                    WHEN o.ID IS NOT NULL THEN o.OrganizationUserName
                    ELSE NULL
                END AS UserName,

                b.PostTitle,
                b.Content,
                b.Image,

                -- Time ago in human-readable format
                CASE 
                    WHEN TIMESTAMPDIFF(HOUR, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
                        CONCAT(TIMESTAMPDIFF(HOUR, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' hours ago')
                    WHEN TIMESTAMPDIFF(MINUTE, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
                        CONCAT(TIMESTAMPDIFF(MINUTE, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' minutes ago')
                    ELSE 
                        CONCAT(TIMESTAMPDIFF(SECOND, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' seconds ago')
                END AS TimeAgo,
                -- Total Likes of this post
                (SELECT COUNT(*) FROM nexus.like WHERE BID = b.ID) AS Likes,

                -- Total Comments of this post
                (SELECT COUNT(*) FROM nexus.comments WHERE BID = b.ID) AS Comments,

                -- Is user already liked?
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM nexus.like 
                        WHERE BID = b.ID AND UID = :UID
                    ) 
                    THEN TRUE 
                    ELSE FALSE 
                END AS IsLiked

            FROM nexus.blogtable AS b
            LEFT JOIN nexus.user AS u
                ON u.ID = b.UID 
            LEFT JOIN nexus.organization AS o
                ON o.ID = b.OID 
            Order by rand();
           -- ORDER BY b.CreatedDate DESC;
        `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const EventFeeds = await sequelize.query(
      `
            SELECT 
                ea.ID As ID,
                ea.EventActivityName,
                CONCAT(r.RoomName,', ',b.BuildingName) AS Name,
                DATE_FORMAT(ea.EventDate, '%b %d') AS EventDate,     
                DATE_FORMAT(ea.StartingTime, '%l:%i %p') AS StartingTime, 
                s.Name As EventTypeName
            FROM nexus.eventsandactivities AS ea
            LEFT JOIN nexus.images AS im
                ON im.ID = ea.ImgID
            LEFT JOIN nexus.building AS b
                ON b.ID = ea.BuildingID
            LEFT JOIN nexus.rooms AS r
                ON r.ID = ea.RoomID
            LEFT JOIN nexus.status AS s
                ON s.ID = ea.EventType
            WHERE DATE(ea.StartingTime) >= CURDATE()
            ORDER BY ea.StartingTime;
        `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    success = true;
    return res.status(200).json({ success, Blogsfeeds, EventFeeds });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, error.message);
  }
};

module.exports.explore = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const userDate = await sequelize.query(
      `
              SELECT 
                    u.ID As id,
                    CONCAT(u.FirstName, ' ', u.LastName) AS name,
                    im.ImageURL As image,
                    ui.BIO As bio,
                    s.Name As year,
                    ss.Name As major,
                    ut.Name AS SourceTable,
                    (
                        SELECT JSON_ARRAYAGG(it.Interest)
                        FROM nexus.interesttable AS it
                        WHERE it.UID = u.ID
                    ) AS skills,
                    -- Follow Status: Does current user follow THIS user?
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM nexus.followers AS f
                            WHERE f.FollowerID = u.ID   
                            AND f.FollowingID = :UID -- CURRENT USER ID
                            AND f.IsDeleted = 0
                        )
                        THEN TRUE
                        ELSE FALSE
                    END AS isFollowing
                    
                FROM nexus.user AS u
                LEFT JOIN nexus.userinfo AS ui
                    ON ui.UID = u.ID
                LEFT JOIN nexus.status AS s
                    ON s.ID = ui.StudentType
                LEFT JOIN nexus.status AS ss
                    ON ss.ID = ui.Majors
                LEFT JOIN nexus.usertype AS ut
                ON ut.ID = u.UTID 
                LEFT JOIN nexus.images AS im
                    ON im.ID = ui.ImgID
                Where ui.IsDeleted = 0 AND ut.IsDeleted = 0 AND ut.ID !=1 AND u.ID != :UID
                Order By rand(); 
        `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const orgDate = await sequelize.query(
      `
                SELECT 
                    o.ID,
                    o.OrganizationName AS Name,
                    im.ImageURL As image,
                    oi.AboutUs As description,
                    s.Name As category,
                   -- CONCAT(r.RoomName,', ',bi.BuildingName) AS location,
                    (Select Count(*) from nexus.manageorganization where OID =  o.ID) As members,
                    -- Check if CURRENT USER is joined → TRUE / FALSE
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM nexus.manageorganization 
                            WHERE OID = o.ID 
                            AND UID = :UID          -- 👈 CURRENT USER ID
                            AND IsRemove = 0
                        ) 
                        THEN TRUE 
                        ELSE FALSE 
                    END AS isJoined
                FROM nexus.organization AS o
                LEFT JOIN nexus.organizationinfo AS oi
                ON oi.OID = o.ID
                LEFT JOIN nexus.images AS im
                    ON im.ID = o.ImgID
                LEFT JOIN nexus.status As s
                    ON s.ID  = o.OrganizationType
               -- LEFT JOIN nexus.building As bi
               --     ON bi.ID =  oi.BID
               -- LEFT JOIN nexus.rooms As r
               --     ON r.ID =  oi.RID
                Where o.IsDeleted = 0
                Order By rand();  
        `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, userDate, orgDate });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, error.message);
  }
};

module.exports.userinfo = async (req, res) => {
  let success = false;
  try {

    

  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};
