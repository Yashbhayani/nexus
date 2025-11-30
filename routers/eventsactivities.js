const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  get,
  post,
  put,
  join,
  deleteevent,
  approved,
  rejected,
  adminevent,
} = require("../controller/eventsactivitycontroller");
const fetchUser = require("../midlewere/fetchuser");
const getStorage = require("../config/multer");

router.get("/", fetchUser, get);
router.post(
  "/",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("event", req) }).single(
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
    const upload = multer({ storage: getStorage("event", req) }).single(
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

router.patch("/join", fetchUser, join);
router.delete("/delete-event", fetchUser, deleteevent);
router.patch("/approved", fetchUser, approved);
router.patch("/rejected", fetchUser, rejected);
router.get("/adminevent", fetchUser, adminevent);

module.exports = router;
