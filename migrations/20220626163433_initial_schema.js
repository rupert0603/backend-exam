/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");

    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("address");
    table.string("post_code", 10);
    table.string("contact_phone_number", 20);
    table.string("email").notNullable();
    table.unique("email");
    table.string("username").notNullable();
    table.unique("username");
    table.string("password").notNullable();
    table.enu("role", ["ADMIN", "USER"]).notNullable();
    table.boolean("is_active").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("users");
};
