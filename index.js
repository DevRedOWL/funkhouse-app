const { initDB } = require("./app/db.js");
const config = require("./app/config.js");
const { options } = require("./app/ssl.service.js");
const app = require("./app/app.js");

initDB(() => {
  // Listen 80 port
  app.listen(config.app.http_port, function () {
    console.log(`HTTP ready on http://localhost:${config.app.http_port}`);
  });
  require("https")
    .createServer({ SNICallback: options.SNICallback }, app)
    .listen(config.app.https_port, () => {
      console.log(`HTTPS ready on http://localhost:${config.app.https_port}`);
    });
});
