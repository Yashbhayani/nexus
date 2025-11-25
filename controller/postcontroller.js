const { request } = require("express");
const BlogTable = require("../models/blogtable");
const Status = require("../models/status");
const { route } = require("../routers/eventsactivities");
const e = require("express");

module.exports.get = async (req, res) => {
  let success = false;
  try {
    // Your logic here
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
      return res.status(404).send("Not Found User", success);
    }

    const { PostTitle, Content, CategoryID } = req.body;
    let path = null;
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
      PostTitle,
      Content,
      CategoryID,
      ImagePath: path,
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

    const { ID, PostTitle, Content, CategoryID } = req.body;
    let path = null;
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

    const updatedPost = await BlogTable.findByPk(ID);

    if (!updatedPost) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    updatedPost.PostTitle = PostTitle;
    updatedPost.Content = Content;
    updatedPost.CategoryID = CategoryID;
    if (path) {
      updatedPost.ImagePath = path;
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

    if (!postToDelete) {
      return res.status(404).json({ success, error: "Post not found" });
    }

    postToDelete.IsDeleted = true;
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
