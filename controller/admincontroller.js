const { request } = require("express");
const e = require("express");

module.exports.get = async (req, res) => {
  let success = false;
  try {
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, error.message);
  }
};
