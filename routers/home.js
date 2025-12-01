const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  feed,
  explore,
  userinfo,
  otheruserinfo,
  orgdata,
} = require("../controller/homecontroller");

router.get("/", fetchUser, feed);
router.get("/explore", fetchUser, explore);
router.get("/otheruserinfo", fetchUser, otheruserinfo);
router.get("/userinfo", fetchUser, userinfo);
router.get("/orgdata", fetchUser, orgdata);

module.exports = router;
