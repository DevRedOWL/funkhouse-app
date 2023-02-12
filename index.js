const express = require("express");
const app = express();
const port = process.env.APP_PORT;
const http = require("http").Server(app);
const path = require("path");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "/dist"));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/dist/splash.png");
});

const csv = require("csv-parser");
const fs = require("fs");
const db = [];

app.use(express.static("dist"));

app.get("/findTicket", (req, res) => {
  const { name, surname } = req.query;
  console.log(name, surname);
  if (!name || !surname)
    return res.status(404).send("Не введены имя или фамилия");

  const nameFilter = db.filter(
    (item) => item.NAME.toLowerCase().indexOf(name.toLowerCase()) !== -1
  );
  const surnameFilter = nameFilter.filter(
    (item) => item.SURNAME.toLowerCase().indexOf(surname.toLowerCase()) !== -1
  );

  if (surnameFilter.length == 0) res.status(400).send("Гость не найден");
  if (surnameFilter.length > 1)
    res.status(400).send("Найдено больше одного человека, уточните данные");

  const result = surnameFilter[0];
  return res.send({ id: result.ID });
});

app.get(
  "/admin/321832787312894712678yhdshgfdsyft78921dgdft6127tgy23dg713tgtdt7",
  (req, res) => {
    return res.sendFile(__dirname + "/dist/admin.html");
  }
);

app.get("/ticket", (req, res) => {
  const ticketId = Number(req.query?.id);
  if (!ticketId || isNaN(ticketId)) return res.send("No ticket");

  const foundTicket = db.filter((item) => item.ID == ticketId)[0];
  if (!foundTicket) return res.send("No ticket");
  console.log(foundTicket);
  return res.render("index.html", {
    name: foundTicket.NAME + " " + foundTicket.SURNAME,
    price: foundTicket.TICKET_PRICE,
    type: foundTicket.TICKET_TYPE,
    id: foundTicket.ID,
    link: foundTicket.LINK,
  });
});

app.get("/ticket/check", (req, res) => {
  const ticketId = Number(req.query?.id);
  if (!ticketId || isNaN(ticketId)) return res.send("No ticket");

  const foundTicket = db.filter((item) => item.ID == ticketId)[0];
  if (!foundTicket) return res.send("No ticket");
  console.log(foundTicket);
  fs.writeFileSync(
    __dirname + "/tickets/" + foundTicket.ID,
    JSON.stringify({
      time: Date.now(),
      id: foundTicket.ID,
    })
  );
  return res.render("index.html", {
    name: foundTicket.NAME + " " + foundTicket.SURNAME,
    price: foundTicket.TICKET_PRICE,
    type: foundTicket.TICKET_TYPE,
    id: foundTicket.ID,
    link: foundTicket.LINK,
  });
});

app.get("/splash.png", (req, res) => {
  return res.sendFile(__dirname + "/dist/splash.png");
});

fs.createReadStream("db.csv")
  .pipe(csv())
  .on("data", (data) => db.push(data))
  .on("end", () => {
    console.log("Found tickets: ", db.length);
    http.listen(port, function () {
      require("dns").lookup(
        require("os").hostname(),
        function (error, address, family) {
          console.log(`HTTP ready on :${address}:${port}`);
        }
      );
    });
  });
