const express = require("express");
const QRCode = require("qrcode");

const { app } = require("./config.js");
const { FunkhouseTicket, Op, sequelize } = require("./db.js");
const adminGuard = require("./admin.guard.js");

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Tickets?");
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

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  const ticket = await FunkhouseTicket.findOne({
    where: { code },
  });
  if (!ticket) {
    return res.sendStatus(404);
  }
  return res.render("./ticket.html", {
    id: app.fakeTickets + ticket.id,
    name: ticket.name,
    price: ticket.price,
    checked: ticket.checked,
    social: ticket.social,
    qr: ticket.code,
    isAdmin: req?.signedCookies?.isAdmin === "true",
  });
});

router.get("/:code/qr", async (req, res) => {
  const { code } = req.params;
  const qrcode = await QRCode.toDataURL(`http://funkhouse.ru/ticket/${code}`);
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
