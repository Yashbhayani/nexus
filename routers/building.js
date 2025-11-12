const express = require("express");
const router = express.Router();
const { get, post } = require("../controller/buildingcontroller");
const fetchUser = require("../midlewere/fetchuser");

// Get all user types
router.get("/", fetchUser, get);
// Create new user type
router.post(
  "/",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("building", req) }).single(
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
    const upload = multer({ storage: getStorage("building", req) }).single(
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

router.delete("/", fetchUser, removebd);
module.exports = router;
