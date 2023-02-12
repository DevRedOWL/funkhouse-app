require("dotenv").config();

exports.app = {
  port: process.env.APP_PORT || 3000,
  defaultPrice: process.env.APP_DEFAULT_PRICE,
};

exports.db = {
  dialect: "postgres",
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "funkhouse-app-postgres",
  port: process.env.DB_PORT || "5432",
};
