const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { Cloudnary } = require("../credentials");

dotenv.config();

cloudinary.config({
  cloud_name: Cloudnary.CLOUDINARY_CLOUD_NAME,
  api_key: Cloudnary.CLOUDINARY_API_KEY,
  api_secret: Cloudnary.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
