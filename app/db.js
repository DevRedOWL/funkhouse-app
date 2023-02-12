const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const { db, app } = require("./config");

const { dialect, user, password, host, port, database } = db;
const sequelize = new Sequelize(
  `${dialect}://${user}:${password}@${host}:${port}/${database}`,
  {
    logging: false,
    query: { raw: true },
  }
);

class FunkhouseTicket extends Model {}
FunkhouseTicket.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.CITEXT,
      allowNull: false,
    },
    price: {
      defaultValue: app.defaultPrice,
      type: DataTypes.INTEGER,
    },
    social: {
      defaultValue: "INSTAGRAM",
      type: DataTypes.STRING,
    },
    checked: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    code: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  { sequelize, modelName: "funkhouse_ticket" }
);

async function initDB(callback) {
  await sequelize.transaction(async (t) => {
    await sequelize.query(
      "CREATE EXTENSION IF NOT EXISTS citext", // WITH SCHEMA public;
      { transaction: t }
    );
  });
  await sequelize.sync({ alter: true });
  return callback();
}

module.exports = { Op, sequelize, initDB, FunkhouseTicket };
