const express = require("express");
const { FunkhouseTicket, Op, sequelize } = require("./db.js");
const QRCode = require("qrcode");

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Tickets?");
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
    id: ticket.id,
    name: ticket.name,
    price: ticket.price,
    checked: ticket.checked,
    social: ticket.social,
  });
});

router.get("/:code/qr", async (req, res) => {
  try {
    const { code } = req.params;
    const qrcode = await QRCode.toDataURL(`http://funkhouse.ru/ticket/${code}`);
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(qrcode.split(",")[1], "base64"));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/find/:name", async (req, res) => {
  const { name } = req.params;
  const tickets = await FunkhouseTicket.findAll({
    where: {
      name: { [Op.like]: `%${name}%` },
    },
    limit: 6,
  });
  return res.send({ data: tickets });
});

module.exports = router;
