const express = require("express");
const QRCode = require("qrcode");

const { app } = require("./config.js");
const { FunkhouseTicket, Op, sequelize } = require("./db.js");
const adminGuard = require("./admin.guard.js");
const { generateName } = require("./helpers.js");
const { v4 } = require("uuid");

const router = express.Router();

router.get("/", adminGuard(), async (req, res) => {
  const tickets = await FunkhouseTicket.findAll();
  const data = {
    count: tickets.length,
    revenue: tickets.reduce((acc, curr) => acc + curr.price, 0),
  };
  const list = tickets.sort((t1, t2) => (t1.price > t2.price ? 1 : -1));
  return res.render("../tickets/tickets.html", { data, list });
});

router.post("/", adminGuard(), async (req, res) => {
  const { name, checked, social, price = app.defaultPrice } = req.body;
  if (!name || checked === undefined)
    return res.status(400).send({ message: "name or checked is false" });

  const ticket = await FunkhouseTicket.create({
    name,
    checked,
    price,
    social: social?.toUpperCase() || "НА ВХОДЕ",
  });
  return res.send({ data: ticket });
});

router.get("/find/:name", adminGuard(), async (req, res) => {
  const { name } = req.params;
  const tickets = await FunkhouseTicket.findAll({
    where: {
      name: { [Op.like]: `%${name}%` },
    },
    limit: 6,
  });
  return res.send({ data: tickets });
});

router.get("/random", async (req, res) => {
  return res.render("./ticket.html", {
    id: -1,
    name: generateName(),
    price: 800,
    checked: false,
    social: "TEST",
    qr: v4(),
    premium: false,
    isAdmin: req?.signedCookies?.isAdmin === "true",
  });
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  const ticket = await FunkhouseTicket.findOne({
    where: { code },
  });
  if (!ticket) {
    return res.sendStatus(404);
  }
  const isPremium = app.premiumTickets.indexOf(ticket.id) !== -1;
  return res.render("./ticket.html", {
    id: ticket.id + (isPremium ? 0 : app.fakeTickets),
    name: ticket.name,
    price: ticket.price,
    checked: ticket.checked,
    social: ticket.social,
    qr: ticket.code,
    premium: isPremium,
    isAdmin: req?.signedCookies?.isAdmin === "true",
  });
});

router.get("/:code/qr", async (req, res) => {
  const { code } = req.params;
  const { bg, fg } = req.query;
  const qrcode = await QRCode.toDataURL(`http://funkhouse.ru/tickets/${code}`, {
    color: { dark: fg || "#000000", light: bg || "#ffffff" },
  });
  res.setHeader("Content-Type", "image/png");
  res.send(Buffer.from(qrcode.split(",")[1], "base64"));
});

router.get("/:code/check", adminGuard(), async (req, res) => {
  const { code } = req.params;
  const ticket = await FunkhouseTicket.findOne({
    where: { code },
  });

  if (ticket.checked) {
    return res.status(403).send("Ticket is already checked");
  }
  const [updated] = await FunkhouseTicket.update(
    { checked: true },
    { where: { id: ticket.id } }
  );
  res.send({ data: { success: !!updated } });
});

module.exports = router;
