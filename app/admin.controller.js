const express = require("express");
const path = require("path");
const { cookieSecret } = require("./config.js").app;
const adminGuard = require("./admin.guard.js");

const router = express.Router();

router.get("/", adminGuard(), (req, res) => {
  return res.sendFile(path.join(__dirname + "/../dist/admin/admin.html"));
});

router.get("/login", (req, res) => {
  const { token } = req.query;
  if (token === cookieSecret) {
    res.cookie("isAdmin", "true", {
      signed: true,
    });
    return res.redirect("/admin");
  } else res.status(403).send({ message: "А тебя это ебать не должно" });
});

router.get("/logout", adminGuard(), (req, res) => {
  res.clearCookie("isAdmin");
  res.send(200);
});

module.exports = router;
