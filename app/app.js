const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const TicketsController = require("./tickets.controller.js");
const AdminController = require("./admin.controller.js");

const app = express();
app.use(cookieParser());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "../dist/ticket"));
app.use(express.static("dist"));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/dist/splash.png");
});

app.use("/tickets", TicketsController);
app.use("/admin", AdminController);

app.get("/splash.png", (req, res) => {
  return res.sendFile(__dirname + "/dist/splash.png");
});

module.exports = app;
