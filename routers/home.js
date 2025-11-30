const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  feed,
  explore
} = require("../controller/homecontroller");

router.get("/", fetchUser, feed);
router.get("/explore", fetchUser, explore);

module.exports = router;
