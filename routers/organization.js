const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  get,
  post,
  put,
  join,
} = require("../controller/organizationcontroller");
const fetchUser = require("../midlewere/fetchuser");
const getStorage = require("../config/multer");

// Get all user types
router.get("/", fetchUser, get);
// Create new user type
router.post(
  "/",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("organization", req) }).single(
      "image"
    );
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  post
);
router.put(
  "/",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("organization", req) }).single(
      "image"
    );
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  put
);
router.put("/join", fetchUser, join);
router.post("/view-organization", fetchUser, join);

module.exports = router;
