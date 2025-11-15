const express = require("express");
const router = express.Router();
const { get, post, put } = require("../controller/organizationcontroller");
const fetchUser = require("../midlewere/fetchuser");

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
router.put("/", fetchUser, put);

module.exports = router;
