const { request } = require("express");
const { Sequelize, where, Model } = require("sequelize");
const sequelize = require("../db");
const UserType = require("../models/usertype");
const User = require("../models/user");
const StatusType = require("../models/statustype");
const { MasterTypes } = require("../enums/codes");
const Status = require("../models/status");
const BlogTable = require("../models/blogtable");
const Like = require("../models/like");
const Comments = require("../models/comments");
const Followers = require("../models/followers");

module.exports.academiclevel = async (req, res) => {
  let success = false;
  try {
    const StatusTypes = await StatusType.findOne({
      where: { Code: MasterTypes.Ad.toUpperCase() },
      attributes: ["ID"],
    });

    if (!StatusTypes) {
      return res.status(404).json({ error: "No record found", success });
    }

    const statusdata = await Status.findAll({
      where: { STID: StatusTypes.ID, IsDeleted: false },
      attributes: ["Code", "Name"],
    });

    if (!statusdata) {
      return res.status(404).json({ error: "No record found", success });
    }
    success = true;
    res.status(200).json({ statusdata, success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.major = async (req, res) => {
  let success = false;
  try {
    const StatusTypes = await StatusType.findOne({
      where: { Code: MasterTypes.Majors.toUpperCase() },
      attributes: ["ID"],
    });

    if (!StatusTypes) {
      return res.status(404).json({ error: "No record found", success });
    }

    const statusdata = await Status.findAll({
      where: { STID: StatusTypes.ID },
      attributes: ["Code", "Name"],
    });

    if (!statusdata) {
      return res.status(404).json({ error: "No record found", success });
    }

    success = true;
    res.status(200).json({ statusdata, success });
  } catch (err) {
    res.status(500).json({ error: err.message, success });
  }
};

module.exports.like = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { BID } = req.query;

    // Check Blog Exists
    const blogExists = await BlogTable.findOne({
      where: { ID: BID },
    });
    if (!blogExists) {
      return res.status(400).json({ success, error: "Blog not available!" });
    }

    // Check if LIKE exists
    const existingLike = await Like.findOne({
      where: { BID, UID: Userdata.ID },
    });

    // CASE 1: Already liked → Unlike (soft delete)
    if (existingLike && Boolean(!existingLike.IsDeleted)) {
      await Like.update(
        { IsDeleted: true },
        { where: { BID, UID: Userdata.ID } }
      );

      success = true;
      return res
        .status(200)
        .json({ success, message: "UnLiked Successfully!" });
    }

    // CASE 2: Previously unliked → Like again
    if (existingLike && Boolean(existingLike.IsDeleted)) {
      await Like.update(
        { IsDeleted: false },
        { where: { BID, UID: Userdata.ID } }
      );

      success = true;
      return res
        .status(200)
        .json({ success, message: "Like added Successfully!" });
    }

    // CASE 3: No like entry → Create new like
    await Like.create({
      BID,
      UID: Userdata.ID,
      CreatedByID: Userdata.ID,
    });

    success = true;
    return res
      .status(200)
      .json({ success, message: "Like added Successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.comments = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { BID, comment } = req.body;

    if (!BID || !comment) {
      return res
        .status(400)
        .json({ error: "Please enter all the fields", success });
    }

    if (!(await BlogTable.findOne({ where: { ID: BID } }))) {
      res.status(400).json({ error: "Blog is not available!", success });
    }

    const AddComments = await Comments.create({
      BID: BID,
      UID: Userdata.ID,
      CommentText: comment,
    });

    if (!AddComments) {
      res.status(400).json({ error: "Server Error!", success });
    }

    success = true;
    res.status(200).json({ success, message: "Comment Added SucessFully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.getcomments = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { BID } = req.query;

    if (!(await BlogTable.findOne({ where: { ID: BID } }))) {
      res.status(400).json({ error: "Blog is not available!", success });
    }

    const getcommenst = await sequelize.query(
      `
        SELECT 
          c.ID As CommentID,
          u.ID As UserId,
          (
							SELECT i.ImageURL 
							FROM nexus.userinfo AS uu
							LEFT JOIN nexus.images AS i ON i.ID = uu.ImgID
							WHERE uu.UID = u.ID
						) AS UserImage,
        CONCAT(u.FirstName, ' ', u.LastName) AS Name,
          CASE
              WHEN TIMESTAMPDIFF(SECOND, c.CreatedByDate, NOW()) < 60 
                  THEN CONCAT(TIMESTAMPDIFF(SECOND, c.CreatedByDate, NOW()), 's ago')
              WHEN TIMESTAMPDIFF(MINUTE, c.CreatedByDate, NOW()) < 60 
                  THEN CONCAT(TIMESTAMPDIFF(MINUTE, c.CreatedByDate, NOW()), 'm ago')
              WHEN TIMESTAMPDIFF(HOUR, c.CreatedByDate, NOW()) < 24 
                  THEN CONCAT(TIMESTAMPDIFF(HOUR, c.CreatedByDate, NOW()), 'h ago')
              WHEN TIMESTAMPDIFF(DAY, c.CreatedByDate, NOW()) < 7 
                  THEN CONCAT(TIMESTAMPDIFF(DAY, c.CreatedByDate, NOW()), 'd ago')
              ELSE DATE_FORMAT(c.CreatedByDate, '%b %d, %Y')
          END AS TimeAgo,
        c.CommentText As comment
      FROM nexus.comments As c
      Left JOIN nexus.user As u
        ON u.ID = c.UID
      where c.BID = :BID
      order by rand();

      `,
      {
        replacements: { BID: BID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    res.status(200).json({ success, getcommenst });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};

module.exports.followuser = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { UserID } = req.query;

    if (!(await User.findOne({ where: { ID: UserID } }))) {
      success = false;
      return res.status(200).json({
        error: "User, Not Found",
        success,
      });
    }

    // Check if follow row exists
    const existing = await Followers.findOne({
      where: {
        FollowerID: UserID,
        FollowingID: Userdata.ID,
      },
    });

    // ------------------------------------
    // IF NOT EXISTS → FOLLOW USER
    // ------------------------------------
    if (!existing) {
      await Followers.create({
        FollowerID: UserID,
        FollowingID: Userdata.ID,
        IsDeleted: false,
      });

      success = true;
      return res.status(200).json({
        success,
        message: "Followed successfully!",
        IsFollowing: true,
      });
    }

    // ------------------------------------
    // IF EXISTS AND IsDeleted = 1 → RE-FOLLOW
    // ------------------------------------
    if (existing.IsDeleted) {
      await Followers.update(
        { IsDeleted: false },
        {
          where: {
            FollowerID: UserID,
            FollowingID: Userdata.ID,
          },
        }
      );

      success = true;
      return res.status(200).json({
        success,
        message: "Followed successfully!",
        IsFollowing: true,
      });
    }

    // ------------------------------------
    // IF EXISTS AND IsDeleted = 0 → UNFOLLOW
    // ------------------------------------
    await Followers.update(
      { IsDeleted: true },
      {
        where: {
          FollowerID: UserID,
          FollowingID: Userdata.ID,
        },
      }
    );

    success = true;
    return res.status(200).json({
      success,
      message: "Unfollowed successfully!",
      IsFollowing: false,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(success, err.message);
  }
};
