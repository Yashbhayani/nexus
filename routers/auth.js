const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetchUser = require('../midlewere/fetchuser');
const getStorage = require('../config/multer');

const {login, createaccount, userinfo} = require('../controller/authcontroller');

router.post('/login', login);
router.post('/create-account', createaccount);
router.post(
  '/user-info',
  fetchUser,
  (req, res, next) => {
    const upload = multer({ storage: getStorage('User', req) }).single('image');
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  },
  userinfo
);

module.exports = router;
