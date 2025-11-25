const { request } = require("express");
const e = require("express");
const User = require("../models/user");

module.exports.get = async (req, res) => {
  let success = false;
  try {

     let Userdata = await User.findByPk(req.user.id, {
      attributes: ["ID", "UTID", "FirstName", "LastName", "Email"],
      raw: true,
    });
    if (!Userdata) {
      return res.status(404).send("Not Found User", success);
    }

    
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, error.message);
  }
};
