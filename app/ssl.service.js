const tls = require("tls");
const fs = require("fs");

const domains = {
  ws: "wareandsoft.com",
  fh: "funkhouse.ru",
};

function getSecureContext(domain) {
  return tls.createSecureContext({
    key: fs.readFileSync(`${__dirname}/../ssl/${domain}.key`),
    cert: fs.readFileSync(`${__dirname}/../ssl/${domain}.crt`),
  }).context;
}

const secureContext = {
  [domains.fh]: getSecureContext("fh"),
  [domains.ws]: getSecureContext("ws"),
  // etc
};

module.exports = {
  options: {
    SNICallback: function (domain, cb) {
      return cb(null, secureContext[domain]);
    },
  },
};
