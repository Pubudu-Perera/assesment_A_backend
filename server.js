require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

// connecting to the MongoDB Atlas
connectDB();

// Handling cors
// 3rd party middleware
app.use(cors(corsOptions));

// 3rd party middleware
app.use(cookieParser());

app.use(express.json());

// // auth routes
app.use('/auth', require('./routes/authRoute'));

// user routes
app.use('/users', require('./routes/userRegRoute'));

// connect to the MongoDB & run the NODE app using Mongoose
mongoose.connection.once("open", () => {
  console.log("The system is coonected to MongoDb");
  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
});

// If the connection with mongoDB has an error
mongoose.connection.on("error", (err) => {
  console.error(err);
});
