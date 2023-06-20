require("dotenv").config();

exports.app = {
  http_port: process.env.APP_PORT || 3000,
  https_port: process.env.SSL_PORT || 3001,
  defaultPrice: Number(process.env.APP_DEFAULT_PRICE) || 0,
  fakeTickets: Number(process.env.APP_FAKE_TICKETS) || 0,
  premiumTickets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  cookieSecret: process.env.APP_COOKIE_SECRET,
};

exports.db = {
  dialect: "postgres",
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "funkhouse-app-postgres",
  port: process.env.DB_PORT || "5432",
};

exports.ssl = {
  ACME: {
    default: "ybVtb1PJCqyS-4o1xk_hZGoIn5RegcV2Vrn_Qecvocw",
  },
};
