const express = require("express");
const router = express.Router();
const {
  academiclevel,
  major,
  like,
  comments,
  getcomments,
  followuser
} = require("../controller/useractivitycontroller");
const fetchUser = require("../midlewere/fetchuser");

// Get all user types
router.get("/academic-level", academiclevel);
router.get("/major", major);
router.get("/like", fetchUser, like);
router.post("/comments", fetchUser, comments);
router.get("/comments", fetchUser, getcomments);
router.get("/followuser", fetchUser, followuser);
// Create new user type

module.exports = router;
