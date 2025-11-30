const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  adminpanel,
  getuserorg,
  deleteaccount,
} = require("../controller/admincontroller");

router.get("/adminpanel", fetchUser, adminpanel);
router.get("/getuserorg", fetchUser, getuserorg);
router.patch("/delete-account", fetchUser, deleteaccount);

module.exports = router;
