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
    success = true;

    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const Blogsfeeds = await sequelize.query(
      `
            select 
                b.ID As ID,
                -- Name field
                CASE 
                    WHEN u.ID IS NOT NULL THEN COALESCE(CONCAT(u.FirstName, ' ', u.LastName), SUBSTRING_INDEX(u.Email, '@', 1))
                    WHEN o.ID IS NOT NULL THEN COALESCE(o.OrganizationName)
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
            (Select Count(*) FROM nexus.like where BID = b.ID) AS Likes,
            (Select Count(*) FROM nexus.comments where BID = b.ID) AS Comments
            from nexus.blogtable As b
            Left join nexus.user As u
            ON u.ID = b.UID 
            Left join nexus.organization As o
            ON o.ID = b.OID 
            order by b.CreatedDate Desc;
        `,
      {
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
