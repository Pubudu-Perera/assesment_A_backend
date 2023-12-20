const User = require("../models/User");
const asyncHandler = require("express-async-handler"); //Easily handles try-catch part of async methods. DO NOT need to declare try-catch
const bcrypt = require("bcrypt");

// @desc get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean(); // select() for send the user data without password values

  if (!users?.length) {
    return res.status(400).json({ message: "No User Data" });
  }

  res.json(users);
});

// @desc add new user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
  // data which is coming from the request
  const { username, password, email } = req.body; //attributes must be same as the keys passed in the request

  // Checks all fields are filled
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Checks for duplicates
  // coolation method use to identify unique values with case insensitivity.
  //lean() use to fetch only the necessary attribute instead of fetching entire object
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicateUsername) {
    return res.status(409).json({ message: "The username is already taken!" });
  }

  if (duplicateEmail) {
    return res.status(409).json({ message: "The E-mail is already taken!" });
  }

  // encrypt the password
  // 10 is for salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  // Making the new user object
  const newUser = {
    username: username,
    password: hashedPassword,
    email,
  };

  // send the POST request to the database
  const user = await User.create(newUser);

  if (user) {
    res
      .status(201)
      .json({ message: `User ${username} is successfully created!` });
  } else {
    res.status(400).json({ message: `Invalid User data recieved!` });
  }
});

module.exports = {
    getAllUsers,
    createUser
}