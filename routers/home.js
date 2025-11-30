const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  feed
} = require("../controller/homecontroller");

router.get("/", fetchUser, feed);

module.exports = router;
