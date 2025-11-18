const { request } = require("express");
const { Op } = require("sequelize");
const Building = require("../models/building");
const User = require("../models/user");
const Room = require("../models/rooms");
const verifyUsers = require("../midlewere/userferification");
//const { encryptedData, decrypt } = require("../config/crypto");
const router = require("../routers/usertype");

// Get all user types
module.exports.get = async (req, res) => {
  let success = false;
  try {
    const { BID } = req.body;

    if (!BID) {
      return res.status(400).json({ error: "BID is required", success });
    }

    // Your code for handling GET request goes here
    const rooms = await Room.findAll({
      where: { BuildingID: BID, IsDeleted: false },
      attributes: ["ID", "Code", "RoomNumber"],
    });

    if (rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found", success });
    }

    //  const encryptedRooms = encryptedData(rooms);
    success = true;
    res.status(200).json({ rooms: rooms, success });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.post = async (req, res) => {
  let success = false;
  try {
    let { BID, Code, RoomName, Capacity } = req.body;
    const { path } = req.file;
    console.log(BID, Code, RoomName, Capacity, path);

    const imagePath = req.file ? req.file.path : null;

    if (!BID || !Code || !RoomName || !Capacity) {
      return res
        .status(400)
        .json({ error: "All fields are required", success });
    }

    //const decryptBid = decrypt(BID);

    if (!(await Building.findOne({ where: { ID: BID } }))) {
      res.status(400).json({ error: "Building is not valid", success });
    }
    // Your code for handling POST request goes here

    if (await Room.findOne({ where: { Code: Code } })) {
      return res
        .status(400)
        .json({ error: "Room code already exists", success });
    }

    // console.log(
    //   await Building.findOne({ where: { ID: BID }, attributes: ["Code"] })
    // );

    const newRoom = await Room.create({
      BID,
      Code,
      RoomName,
      Capacity,
      Image: imagePath,
    });

    //const encryptedRoom = encryptedData(newRoom);
    success = true;
    res.status(201).json({ room: newRoom, success });
  } catch (error) {
    res.status(500).json({ error: error.message, success });
  }
};
