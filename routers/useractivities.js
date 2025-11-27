const express = require("express");
const router = express.Router();
const { academiclevel, major } = require("../controller/useractivitycontroller");
const fetchUser = require("../midlewere/fetchuser");

// Get all user types
router.get("/academic-level", academiclevel);
router.get("/major", major);
// Create new user type

module.exports = router;
