const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  adminpanel,
  getuserorg,
  deleteaccount,
  adminevent,
} = require("../controller/admincontroller");

router.get("/adminpanel", fetchUser, adminpanel);
router.get("/getuserorg", fetchUser, getuserorg);
router.patch("/delete-account", fetchUser, deleteaccount);
router.get("/adminevent", fetchUser, adminevent);

module.exports = router;
