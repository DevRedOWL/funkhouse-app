const express = require("express");
const path = require("path");
const { FunkhouseTicket, Op, sequelize } = require("./db.js");

const router = express.Router();

router.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../dist/admin/admin.html"));
});

router.get("/auth", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../dist/admin/admin.html"));
});

module.exports = router;
