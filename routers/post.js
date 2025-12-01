const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  get,
  post,
  put,
  deletepost,
  userblog,
  adminblogurl,
  orgget,
  orgpost,
  orgdeletepost
} = require("../controller/postcontroller");
const fetchUser = require("../midlewere/fetchuser");
const getStorage = require("../config/multer");

router.get("/", fetchUser, get);
router.post(
  "/",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("blog", req) }).single("image");
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
    const upload = multer({ storage: getStorage("blog", req) }).single("image");
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  put
);

router.delete("/", fetchUser, deletepost);
router.get("/userblog", fetchUser, userblog);
router.get("/adminblogurl", fetchUser, adminblogurl);
router.get("/org-blog", fetchUser, orgget);
router.post(
  "/org-blog",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("blog", req) }).single("image");
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  orgpost
);

router.put(
  "/org-blog",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("blog", req) }).single("image");
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  orgput
);

router.delete("/org-blog", fetchUser, orgdeletepost);

module.exports = router;
