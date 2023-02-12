const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const { cookieSecret } = require("./config.js").app;

const TicketsController = require("./tickets.controller.js");
const AdminController = require("./admin.controller.js");

const app = express();
app.use(cookieParser(cookieSecret));
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "../dist/ticket"));
app.use(express.static("dist"));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "../dist/splash.png"));
});

app.use("/tickets", TicketsController);
app.use("/admin", AdminController);

app.use((err, req, res, next) => {
  console.error(err.message);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).send({ message: err.message });
});

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error.message);
});

module.exports = app;
