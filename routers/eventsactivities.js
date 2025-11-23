const express = require("express");
const router = express.Router();
const multer = require("multer");
const { get } = require("../controller/organizationcontroller");
const fetchUser = require("../midlewere/fetchuser");
const getStorage = require("../config/multer");

router.get("/", fetchUser, get);

module.exports = router;
