const express = require("express");
const router = express.Router();
const multer = require("multer");
const fetchUser = require("../midlewere/fetchuser");
const getStorage = require("../config/multer");

const {
  login,
  createaccount,
  userinfo,
  verifyusertype,
  verifyemail,
  verifyotp,
  newpassword,
  loginData,
} = require("../controller/authcontroller");

router.post("/login", login);
router.post("/create-account", createaccount);
router.post(
  "/user-info",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("User", req) }).single("image");
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  userinfo
);

router.put(
  "/user-info",
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage("User", req) }).single("image");
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  userinfo
);
router.get("/verifyusertype", fetchUser, verifyusertype);
router.get("/verifyemail", verifyemail);
router.patch("/verifyotp", verifyotp);
router.patch("/newpassword", newpassword);
router.get("/user-log-data", fetchUser, loginData);

module.exports = router;
