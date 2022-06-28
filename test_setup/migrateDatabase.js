const knex = require("knex");
const environmentName = process.env.NODE_ENV || "test";
const knexConfig = require("../knexfile")[environmentName];

const db = knex(knexConfig);

module.exports = async () => {
  await db.migrate.latest();

  await db.destroy(); //jest will hang after running all test without destroying this
};
