const express = require("express");
const router = express.Router();
const {
  get,
  post,
  put,
  deletecode,
} = require("../controller/usetypercontroller");
const fetchUser = require("../midlewere/fetchuser");

// Get all user types
router.get("/", fetchUser, get);
// Create new user type
router.post("/", fetchUser, post);
router.put("/", fetchUser, put);
router.delete("/", fetchUser, removeut);

module.exports = router;
