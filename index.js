const { initDB } = require("./app/db.js");
const config = require("./app/config.js");
const app = require("./app/app.js");

initDB(() => {
  app.listen(config.app.port, function () {
    console.log(`HTTP ready on http://localhost:${config.app.port}`);
  });
});
