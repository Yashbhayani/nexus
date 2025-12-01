const { request } = require("express");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const BlogTable = require("../models/blogtable");
const Status = require("../models/status");
const e = require("express");
const User = require("../models/user");
const { CheckUsers, checkAdminStatus } = require("../config/findSimilarStatus");
const { Useres } = require("../enums/codes");

module.exports.get = async (req, res) => {
  let success = false;
  try {
    // Your logic here
    let ID = req.user.id;
    // Call the function
    let check = await CheckUsers(ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    const { UID } = req.query;

    const UserData = await User.findByPk(UID);
    if (!UserData) {
      return res.status(404).json({ error: "Account has not found", success });
    }
    const userBlogs = await sequelize.query(
      `
      SELECT 
        b.ID AS BID, 
        b.PostTitle AS PostTitle,
        b.Content AS Content, 
        b.Image AS Images, 
        b.CreatedDate AS CreatedDate, 
        b.UpdatedDate AS UpdatedDate,
        st.Name AS Category
      FROM nexus.blogtable AS b
      LEFT JOIN nexus.status AS st
          ON st.ID = b.CategoryID
      WHERE b.UID = :UID
    `,
      {
        replacements: { UID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, userBlogs });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.post = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    const { PostTitle, Content, CategoryID, image } = req.body;
    let { path } = req.file;

    if (image) {
      path = req.file;
    }

    if (!PostTitle || !Content || !CategoryID) {
      return res
        .status(400)
        .json({ success, error: "Please fill all the required fields" });
    }

    if (
      !(await Status.findOne({ where: { ID: CategoryID, IsDeleted: false } }))
    ) {
      return res.status(400).json({ success, error: "Invalid CategoryID" });
    }

    const createPost = await BlogTable.create({
      UID: req.user.id,
      PostTitle,
      Content,
      CategoryID,
      Image: path,
      CreatedByID: req.user.id,
    });

    if (!createPost) {
      return res.status(500).json({ success, error: "Failed to create post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post created successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.put = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID, PostTitle, Content, CategoryID, image } = req.body;

    let { path } = req.file;
    if (!path) {
      path = null;
    }

    if (!PostTitle || !Content || !CategoryID) {
      return res
        .status(400)
        .json({ success, error: "Please fill all the required fields" });
    }

    if (
      !(await Status.findOne({ where: { ID: CategoryID, IsDeleted: false } }))
    ) {
      return res.status(400).json({ success, error: "Invalid CategoryID" });
    }

    const updatedPost = await BlogTable.findByPk(ID);

    if (!updatedPost) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    updatedPost.PostTitle = PostTitle;
    updatedPost.Content = Content;
    updatedPost.CategoryID = CategoryID;
    if (path) {
      updatedPost.Image = path;
    }
    updatedPost.UpdatedByID = req.user.id;

    const createPost = await updatedPost.save();

    if (!createPost) {
      return res.status(500).json({ success, error: "Failed to create post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post created successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.deletepost = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID } = req.query;

    if (!ID) {
      return res
        .status(400)
        .json({ success, error: "Please provide the Post ID" });
    }

    const postToDelete = await BlogTable.findByPk(ID);

    // If not success → return response

    if (!postToDelete) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    // Call the function
    if (postToDelete.UID !== Userdata.ID) {
      return res.status(404).json({ error: "User is not Admin", success });
    }
    
    postToDelete.IsDeleted = true;
    postToDelete.UpdatedByID = Userdata.ID;
    await postToDelete.save();

    if (!postToDelete) {
      return res.status(500).json({ success, error: "Failed to delete post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.userblog = async (req, res) => {
  let success = false;
  try {
    // Your logic here
    let ID = req.user.id;

    // Call the function
    let check = await CheckUsers(ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    const userBlogs = await sequelize.query(
      `
      SELECT 
        b.ID AS BID, 
        b.PostTitle AS PostTitle,
        b.Content AS Content, 
        b.Image AS Images, 
        b.CreatedDate AS CreatedDate, 
        b.UpdatedDate AS UpdatedDate,
        st.Name AS Category
      FROM nexus.blogtable AS b
      LEFT JOIN nexus.status AS st
          ON st.ID = b.CategoryID
      WHERE b.UID = :ID
    `,
      {
        replacements: { ID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    console.log(userBlogs);

    success = true;
    return res.status(200).json({ success, userBlogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.adminblogurl = async (req, res) => {
  let success = false;
  try {
    let ID = req.user.id;

    // Call the function
    let check = await checkAdminStatus(ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    if (check.user != Useres.ADMIN.toUpperCase()) {
      return res.status(404).json({ error: "User is not Admin", success });
    }
    const userBlogs = await sequelize.query(
      `
  SELECT 
      b.ID AS BlogID,
      b.PostTitle,
      b.IsDeleted AS BlogIsDeleted,

      -- Use UpdatedDate if exists, otherwise CreatedDate
      COALESCE(b.UpdatedDate, b.CreatedDate) AS Date,

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

      -- Name field
      CASE 
          WHEN u.ID IS NOT NULL THEN COALESCE(CONCAT(u.FirstName, ' ', u.LastName), SUBSTRING_INDEX(u.Email, '@', 1))
          WHEN o.ID IS NOT NULL THEN COALESCE(o.OrganizationName, o.OrganizationUserName)
          ELSE 'Unknown'
      END AS Name,

      -- UserName field
      CASE 
          WHEN u.ID IS NOT NULL THEN SUBSTRING_INDEX(u.Email, '@', 1)
          WHEN o.ID IS NOT NULL THEN o.OrganizationUserName
          ELSE NULL
      END AS UserName,

      -- Image field
      CASE 
          WHEN u.ID IS NOT NULL THEN uImg.ImageURL
          WHEN o.ID IS NOT NULL THEN oImg.ImageURL
          ELSE NULL
      END AS Image,

      -- Record type
      CASE 
          WHEN u.ID IS NOT NULL THEN 'Student'
          WHEN o.ID IS NOT NULL THEN 'Organization'
          ELSE 'Unknown'
      END AS RecordType,
      (Select count(*) from nexus.like where BID = b.ID AND IsDeleted = 0) As TotalLIke,
      (Select count(*) from nexus.comments where BID = b.ID AND IsDeleted = 0) As TotalComments

  FROM nexus.blogtable AS b
  LEFT JOIN nexus.user AS u
      ON u.ID = b.UID
  LEFT JOIN nexus.userinfo AS ui
      ON ui.UID = u.ID
  LEFT JOIN nexus.images AS uImg
      ON uImg.ID = ui.ImgID
  LEFT JOIN nexus.organization AS o
      ON o.ID = b.OID
  LEFT JOIN nexus.images AS oImg
      ON oImg.ID = o.ImgID
  Where b.IsDeleted = 0
  ORDER BY COALESCE(b.UpdatedDate, b.CreatedDate) DESC;
  `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, userBlogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success, error: err.message });
  }
};

module.exports.orgget = async (req, res) => {
  let success = false;
  try {
    // Your logic here
    let ID = req.user.id;
    // Call the function
    let check = await CheckUsers(ID);

    // If not success → return response
    if (!check.success) {
      return res.status(check.status).json({
        success: false,
        message: check.message,
      });
    }

    const { OID } = req.query;

    const UserData = await User.findByPk(UID);
    if (!UserData) {
      return res.status(404).json({ error: "Account has not found", success });
    }
    const userBlogs = await sequelize.query(
      `
      SELECT 
        b.ID AS BID, 
        b.PostTitle AS PostTitle,
        b.Content AS Content, 
        b.Image AS Images, 
        b.CreatedDate AS CreatedDate, 
        b.UpdatedDate AS UpdatedDate,
        st.Name AS Category
      FROM nexus.blogtable AS b
      LEFT JOIN nexus.status AS st
          ON st.ID = b.CategoryID
      WHERE b.OID = :OID
    `,
      {
        replacements: { OID },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success = true;
    return res.status(200).json({ success, userBlogs });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.orgpost = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });

    if (!Userdata) {
      return res.status(404).json({ success, message: "User not found" });
    }

    const { OID, PostTitle, Content, CategoryID, image } = req.body;
    let { path } = req.file;

    if (image) {
      path = req.file;
    }

    if (!OID || !PostTitle || !Content || !CategoryID) {
      return res
        .status(400)
        .json({ success, error: "Please fill all the required fields" });
    }

    if (
      !(await Status.findOne({ where: { ID: CategoryID, IsDeleted: false } }))
    ) {
      return res.status(400).json({ success, error: "Invalid CategoryID" });
    }

    const createPost = await BlogTable.create({
      OID: OID,
      PostTitle,
      Content,
      CategoryID,
      Image: path,
      CreatedByID: req.user.id,
    });

    if (!createPost) {
      return res.status(500).json({ success, error: "Failed to create post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post created successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.orgput = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID, OID, PostTitle, Content, CategoryID, image } = req.body;

    let { path } = req.file;
    if (!path) {
      path = null;
    }

    if (!ID || !OID || !PostTitle || !Content || !CategoryID) {
      return res
        .status(400)
        .json({ success, error: "Please fill all the required fields" });
    }

    if (
      !(await Status.findOne({ where: { ID: CategoryID, IsDeleted: false } }))
    ) {
      return res.status(400).json({ success, error: "Invalid CategoryID" });
    }

    const updatedPost = await BlogTable.findByPk(ID);

    if (!updatedPost) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    updatedPost.PostTitle = PostTitle;
    updatedPost.Content = Content;
    updatedPost.CategoryID = CategoryID;
    if (path) {
      updatedPost.Image = path;
    }
    updatedPost.UpdatedByID = req.user.id;

    const createPost = await updatedPost.save();

    if (!createPost) {
      return res.status(500).json({ success, error: "Failed to create post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post created successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};

module.exports.orgdeletepost = async (req, res) => {
  let success = false;
  try {
    let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    const { ID } = req.query;

    if (!ID) {
      return res
        .status(400)
        .json({ success, error: "Please provide the Post ID" });
    }

    const postToDelete = await BlogTable.findByPk(ID);

    // If not success → return response

    if (!postToDelete) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    postToDelete.IsDeleted = true;
    postToDelete.UpdatedByID = Userdata.ID;
    await postToDelete.save();

    if (!postToDelete) {
      return res.status(500).json({ success, error: "Failed to delete post" });
    }

    success = true;
    res.status(200).json({ success, message: "Post deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success, error: error.message });
  }
};
