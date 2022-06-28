const knex = require("knex");
const environmentName = process.env.NODE_ENV || "development";
const knexConfig = require("./knexfile")[environmentName];

const db = knex(knexConfig);

const closeConnection = () => db.destroy();

module.exports = {
  db,
  closeConnection,
};
