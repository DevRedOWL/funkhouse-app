const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const { cookieSecret } = require("./config.js").app;
const { performance } = require("perf_hooks");

const TicketsController = require("./tickets.controller.js");
const AdminController = require("./admin.controller.js");

const app = express();
app.use(cookieParser(cookieSecret));
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "../dist/ticket"));
app.use(express.static("dist"));

// Logging middleware
app.use((req, res, next) => {
  const { method, originalUrl, ip } = req;
  const start = performance.now();
  res.on("finish", () => {
    const { statusCode } = res;
    const duration = (performance.now() - start) | 0;
    console.log(
      `${statusCode} | [${method}] ${decodeURIComponent(
        originalUrl
      )} ${ip} ${duration}ms`
    );
  });
  next();
});

// Cookies
app.enable("trust proxy");
app.use((req, res, next) => {
  req.secure || req.headers.host === "localhost"
    ? next()
    : res.redirect("https://" + req.headers.host + req.url);
});

// Main page
app.get("/", (req, res) => {
  if (req.get("host") === "wareandsoft.com") {
    return res.sendFile(path.join(__dirname, "../dist/ws/index.html"));
  }
  return res.sendFile(path.join(__dirname, "../dist/splash/splash.html"));
});
app.get("/ws", (req, res) => {
  return res.sendFile(path.join(__dirname, "../dist/ws/index.html"));
});

// Controllers
app.use("/tickets", TicketsController);
app.use("/admin", AdminController);

// Error handling middleware
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
