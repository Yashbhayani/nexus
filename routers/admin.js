const express = require("express");
const router = express.Router();
const fetchUser = require("../midlewere/fetchuser");
const { get } = require("../controller/admincontroller");

router.get("/", fetchUser, get);

module.exports = router;
