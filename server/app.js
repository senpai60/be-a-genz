const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require('./utils/db')
require("dotenv").config();

const indexRouter = require("./routes/index");
const dataInjectionRouter = require("./routes/dataInjection");

const app = express();

connectDB()
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const whitelist = [process.env.CLIENT_URI, "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow if in whitelist
    if (whitelist.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Otherwise block
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/", indexRouter);
app.use("/inject", dataInjectionRouter);

module.exports = app;
