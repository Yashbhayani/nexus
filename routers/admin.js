const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const {
  adminpanel,
  getuserorg,
  deleteaccount,
  adminevent,
  deleteevent,
} = require("../controller/admincontroller");

router.get("/adminpanel", fetchUser, adminpanel);
router.get("/getuserorg", fetchUser, getuserorg);
router.delete("/delete-account", fetchUser, deleteaccount);
router.delete("/delete-event", fetchUser, deleteevent);
router.get("/adminevent", fetchUser, adminevent);

module.exports = router;
