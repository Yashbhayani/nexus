const { Sequelize, Model } = require("sequelize");
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
                CASE 
                    WHEN u.ID IS NOT NULL THEN u.ID 
                    WHEN o.ID IS NOT NULL THEN o.ID
                    ELSE NULL
                END AS UserID,
                CASE
                  WHEN u.ID IS NOT NULL AND u.ID = :UID THEN TRUE
                  ELSE FALSE
                END AS LoginUserID,
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
                CASE 
                    WHEN u.ID IS NOT NULL THEN False
                    ELSE True
                END AS isOrganization,                
                b.PostTitle,
                b.Content,
                b.Image,
                CASE 
					WHEN u.ID IS NOT NULL THEN 
						(
							SELECT i.ImageURL 
							FROM nexus.userinfo AS uu
							LEFT JOIN nexus.images AS i ON i.ID = uu.ImgID
							WHERE uu.UID = u.ID
						)
					WHEN o.ID IS NOT NULL THEN 
						(
							SELECT i.ImageURL 
							FROM nexus.organization AS oo
							LEFT JOIN nexus.images AS i ON i.ID = oo.ImgID
							WHERE oo.ID = o.ID
						)
					ELSE NULL
				END AS UserImage,


                -- Time ago in human-readable format
                CASE 
                    WHEN TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
                        CONCAT(TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' days ago')
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
            LEFT JOIN nexus.userinfo AS ui
                ON ui.ID = u.ID 
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
                im.ImageURL As Image,
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
            Where ea.Isrejected = 0 AND ea.ApproverByID IS NOT NULL 
              AND DATE(ea.StartingTime) >= CURDATE()
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
                    s.Name As StudentType,
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
                LEFT JOIN nexus.images AS im
                    ON im.ID = ui.ImgID
                LEFT JOIN nexus.status AS s
                    ON s.ID = ui.StudentType
                LEFT JOIN nexus.status AS ss
                    ON ss.ID = ui.Majors
                LEFT JOIN nexus.usertype AS ut
                ON ut.ID = u.UTID 

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
                    END AS isJoined,
                  'organization' AS SourceTable
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

module.exports.otheruserinfo = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }
    let { AUID } = req.query;

    const userinfo = await sequelize.query(
      `
      SELECT 
          CONCAT(u.FirstName, ' ', u.LastName) AS Name,
          s.Name AS StudentType,
          ss.Name AS Majors,
          im.ImageURL AS Image,

          -- Total organizations joined
          (SELECT COUNT(*) 
          FROM nexus.manageorganization 
          WHERE UID = :AUID AND IsRemove = 0) AS Organizations,

          -- Total events attended
          (SELECT COUNT(*) 
          FROM nexus.manageeventandactivities 
          WHERE UID = :AUID AND IsDeleted = 0) AS EventsAttended,

          -- Followers count
          (SELECT COUNT(*) 
          FROM nexus.followers 
          WHERE FollowingID = u.ID AND IsDeleted = 0) AS Followers,

          -- ✔ Follow Status TRUE/FALSE
          CASE 
              WHEN EXISTS (
                  SELECT 1 
                  FROM nexus.followers f
                  WHERE f.FollowerID = :AUID 
                  AND f.FollowingID = :UID
                  AND f.IsDeleted = 0
              ) 
              THEN TRUE
              ELSE FALSE
          END AS IsFollowing

      FROM nexus.user AS u
      LEFT JOIN nexus.userinfo AS ui ON ui.UID = u.ID
      LEFT JOIN nexus.status AS s ON s.ID = ui.StudentType
      LEFT JOIN nexus.status AS ss ON ss.ID = ui.Majors
      LEFT JOIN nexus.images AS im ON im.ID = ui.ImgID
      WHERE u.ID = :AUID;
      `,
      {
        replacements: { UID: Userdata.ID, AUID: AUID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const useraboutinfo = await sequelize.query(
      `
      select 
        ui.bio, 
          (SELECT 
          JSON_ARRAYAGG(it.Interest)
        FROM nexus.interesttable AS it
          WHERE it.UID = ui.UID) AS interest,
        (SELECT 
          JSON_ARRAYAGG(sk.Skill)
        FROM nexus.skillstable AS sk
          WHERE sk.UID = ui.UID) AS skills
      From nexus.userinfo As ui 
      where ui.UID = :UID
      `,
      {
        replacements: { UID: AUID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const userposts = await sequelize.query(
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
                s.Name As CategoryName,
    -- Time ago in human-readable format
    CASE 
        WHEN TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
            CONCAT(TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' days ago')
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
            LEFT JOIN nexus.status As s
              ON s.ID = b.CategoryID
            Where b.UID = :AUID
            ORDER BY b.CreatedDate DESC;  
      `,
      {
        replacements: { UID: Userdata.ID, AUID: AUID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const userorg = await sequelize.query(
      `
      Select 
        o.ID As orgID,
        o.OrganizationName As OrganizationName,
          s.Name As OrganizationType,
          im.ImageURL As image,
          srole.Name As UserRole
      from nexus.organization As o
      Left Join nexus.manageorganization As mo
        ON mo.OID  =  o.ID
      Left Join nexus.status As srole
        ON srole.ID  =  mo.SID
      Left Join nexus.images As im	
        ON im.ID =  o.ImgID
      Left Join nexus.status As s	
        ON s.ID =  o.OrganizationType
      Left Join nexus.user As u
        ON u.ID  = mo.UID
      Where u.ID = :AUID;
      `,
      {
        replacements: { AUID: AUID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    
    res
      .status(200)
      .json({ success, userinfo, useraboutinfo, userposts, userorg });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.userinfo = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    const userinfo = await sequelize.query(
      `
         SELECT 
            CONCAT(u.FirstName, ' ', u.LastName) AS Name,
            s.Name AS StudentType,
            ss.Name AS Majors,
            im.ImageURL AS Image,

            -- Total organizations joined
            (SELECT COUNT(*) 
            FROM nexus.manageorganization 
            WHERE UID = :UID AND IsRemove = 0) AS Organizations,

            -- Total events attended
            (SELECT COUNT(*) 
            FROM nexus.manageeventandactivities 
            WHERE UID = :UID AND IsDeleted = 0) AS EventsAttended,

            -- Followers count
            (SELECT COUNT(*) 
            FROM nexus.followers 
            WHERE FollowingID = u.ID AND IsDeleted = 0) AS Followers,

        FROM nexus.user AS u
        LEFT JOIN nexus.userinfo AS ui ON ui.UID = u.ID
        LEFT JOIN nexus.status AS s ON s.ID = ui.StudentType
        LEFT JOIN nexus.status AS ss ON ss.ID = ui.Majors
        LEFT JOIN nexus.images AS im ON im.ID = ui.ImgID
        WHERE u.ID = :UID;
      
      `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const useraboutinfo = await sequelize.query(
      `
      select 
        ui.bio, 
          (SELECT 
          JSON_ARRAYAGG(it.Interest)
        FROM nexus.interesttable AS it
          WHERE it.UID = ui.UID) AS interest,
        (SELECT 
          JSON_ARRAYAGG(sk.Skill)
        FROM nexus.skillstable AS sk
          WHERE sk.UID = ui.UID) AS skills
      From nexus.userinfo As ui 
      where ui.UID = :UID
      `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const userposts = await sequelize.query(
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
        WHEN TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
            CONCAT(TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' days ago') 
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
            Where b.UID = :UID
            ORDER BY b.CreatedDate DESC;  
      `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const userorg = await sequelize.query(
      `
      Select 
        o.ID As orgID,
        o.OrganizationName As OrganizationName,
          s.Name As OrganizationType,
          im.ImageURL As image,
          srole.Name As UserRole
      from nexus.organization As o
      Left Join nexus.manageorganization As mo
        ON mo.OID  =  o.ID
      Left Join nexus.status As srole
        ON srole.ID  =  mo.SID
      Left Join nexus.images As im	
        ON im.ID =  o.ImgID
      Left Join nexus.status As s	
        ON s.ID =  o.OrganizationType
      Left Join nexus.user As u
        ON u.ID  = mo.UID
      Where u.ID = :UID;
      `,
      {
        replacements: { UID: Userdata.ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    res
      .status(200)
      .json({ success, userinfo, useraboutinfo, userposts, userorg });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.orgdata = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { OID } = req.query;

    const orgData = await sequelize.query(
      `
        SELECT 
              o.ID AS OrganizationID,
              o.OrganizationName AS OrganizationName,
              i.ImageURL AS Image,
              s.Name AS OrganizationType,

              -- Total Members
              (
            SELECT COUNT(*) 
            FROM nexus.manageorganization mo
            WHERE IsRemove = 0 AND mo.OID = o.ID
        ) AS Member,

        -- Total Events Hosted
        (
            SELECT COUNT(*)
            FROM nexus.eventsandactivities ea
            WHERE ea.OID = o.ID AND ea.Isrejected = 0 AND ea.IsDeleted=0
        ) AS EventsHosted,
        (
            SELECT COUNT(*)
            FROM nexus.blogtable bo
            WHERE bo.OID = o.ID AND bo.IsDeleted = 0
        ) AS PublishedPosts
    ,
              -- TRUE/FALSE if user joined
              (
          SELECT s2.Name
          FROM nexus.manageorganization mo
          LEFT JOIN nexus.status s2 ON s2.ID = mo.SID
          WHERE mo.OID = o.ID AND mo.UID = :UID AND mo.IsRemove = 0
          LIMIT 1
        ) AS UserRole,
        'Organization' AS SourceTable

            FROM nexus.organization AS o
            LEFT JOIN nexus.organizationinfo AS oi
              ON oi.OID = o.ID
            LEFT JOIN nexus.status AS s
              ON s.ID = o.OrganizationType
            LEFT JOIN nexus.images AS i
              ON i.ID = o.ImgID
            WHERE o.ID = :OID;
      `,
      {
        replacements: { UID: Userdata.ID, OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const aboutUs = await sequelize.query(
      `
      SELECT 
          oi.AboutUs AS AboutUs,
          oi.Mission AS Mission,
          oi.phone AS Phone,
          oi.email AS Email,
          oi.website AS Website,

          -- President
          (
              SELECT CONCAT(u.FirstName, ' ', u.LastName)
              FROM nexus.manageorganization mo
              LEFT JOIN nexus.user u ON u.ID = mo.UID
              LEFT JOIN nexus.status s ON s.ID = mo.SID
              WHERE mo.OID = oi.OID 
              AND s.Code = 'ODPRESIDENT'
              LIMIT 1
          ) AS President,

          -- Vice President
          (
              SELECT CONCAT(u.FirstName, ' ', u.LastName)
              FROM nexus.manageorganization mo
              LEFT JOIN nexus.user u ON u.ID = mo.UID
              LEFT JOIN nexus.status s ON s.ID = mo.SID
              WHERE mo.OID = oi.OID 
              AND s.Code = 'ODVICEPRESIDENT'
              LIMIT 1
          ) AS VicePresident

      FROM nexus.organizationinfo AS oi
      WHERE oi.OID = :OID;
      `,
      {
        replacements: { OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const eventData = await sequelize.query(
      `
        SELECT 
              ea.ID,
              im.ImageURL,
              ea.EventActivityName,
              b.BuildingName,
              r.RoomName,

              -- Dec 20 Format
              DATE_FORMAT(ea.EventDate, '%b %d, %Y') AS EventDate,
        CONCAT(LPAD(HOUR(ea.StartingTime) % 12, 1, ''), ':', 
            LPAD(MINUTE(ea.StartingTime), 2, '0'), ' ',
            IF(HOUR(ea.StartingTime) < 12, 'AM', 'PM')
        ) AS EventTime,
              s.Name AS EventType,

              -- ---------------------------
              -- Date Category
              -- ---------------------------
              CASE 
                  WHEN DATE(ea.EventDate) = CURDATE() THEN 'Today'
                  WHEN DATE(ea.EventDate) = CURDATE() + INTERVAL 1 DAY THEN 'Tomorrow'
                  WHEN YEARWEEK(ea.EventDate, 1) = YEARWEEK(CURDATE(), 1) THEN 'This Week'
                  WHEN MONTH(ea.EventDate) = MONTH(CURDATE()) 
                      AND YEAR(ea.EventDate) = YEAR(CURDATE()) THEN 'This Month'
                  ELSE 'Upcoming'
              END AS DateCategory,

              -- ---------------------------
              -- RSVP Count
              -- ---------------------------
              (
                  SELECT COUNT(*) 
                  FROM nexus.manageeventandactivities mea 
                  WHERE mea.EAAID = ea.ID 
                  AND mea.IsDeleted = 0
              ) AS Attending

            FROM nexus.eventsandactivities AS ea
            LEFT JOIN nexus.status AS s
              ON s.ID = ea.EventType
            LEFT JOIN nexus.images AS im
              ON im.ID = ea.ImgID
            LEFT JOIN nexus.building AS b
              ON b.ID = ea.BuildingID
            LEFT JOIN nexus.rooms AS r
              ON r.ID = ea.RoomID
            LEFT JOIN nexus.organization AS org
              ON org.ID = ea.OID

            -- Only Today → Future
            WHERE ea.IsDeleted = 0 AND ea.OID = :OID
            AND ea.ApproverByID IS NOT NULL

            ORDER BY ea.EventDate ASC;  
      `,
      {
        replacements: { OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const post = await sequelize.query(
      `
        SELECT 
            b.ID AS ID,
            b.PostTitle,
            b.Content,
            b.Image,

            -- Time ago in human-readable format
            CASE 
              WHEN TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()) > 0 THEN 
                    CONCAT(TIMESTAMPDIFF(DAY, COALESCE(b.UpdatedDate, b.CreatedDate), NOW()), ' days ago')
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
                    (SELECT COUNT(*) FROM nexus.comments WHERE BID = b.ID) AS Comments

            FROM nexus.blogtable AS b
            LEFT JOIN nexus.user AS u
                ON u.ID = b.UID 
            LEFT JOIN nexus.organization AS o
                ON o.ID = b.OID 
            Where b.OID = :OID
            ORDER BY b.CreatedDate DESC;  
  
      `,
      {
        replacements: { OID: OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    res.status(200).json({ orgData, aboutUs, eventData, post, success });
  } catch (error) {
    res.status(500).json({ error: error.message, success });
  }
};
