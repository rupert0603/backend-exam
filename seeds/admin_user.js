const { hashPassword } = require("../services/auth_service");

const adminUser = {
  first_name: "Jane",
  last_name: "Doe",
  address: "Manila",
  post_code: "1045",
  contact_phone_number: "09239999999",
  email: "admin@onlinecmail.com",
  username: "jane_doe",
  password: "789_no_Virus_!",
  role: "ADMIN",
  is_active: 1,
};

exports.adminUser = adminUser;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const hashedPassword = await hashPassword(adminUser.password);

  const newAdminUser = {
    ...adminUser,
    password: hashedPassword,
  };

  await knex("users").insert([newAdminUser]);
};
