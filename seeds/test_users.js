const { hashPassword } = require("../services/auth_service");

const testUsers = [
  {
    first_name: "Sibylle",
    last_name: "Farrah",
    address: "4391 Fancher Drive, Dallas",
    post_code: "75225",
    contact_phone_number: "817-675-8455",
    email: "cikew49033@lenflyfff.com",
    username: "branchweatherly",
    password: "JJUo*3ugZ$Lj",
    role: "USER",
    is_active: 1,
  },
  {
    first_name: "Helgi",
    last_name: "Helgi",
    address: "3551 Medical Center Drive",
    post_code: "34236",
    contact_phone_number: "772-377-1601",
    email: "doogiefresaaaa@wpdork.com",
    username: "eightcharge",
    password: "QknoTxd",
    role: "USER",
    is_active: 1,
  },
  {
    first_name: "Kiefer",
    last_name: "Helgi",
    address: "2166 Progress Way",
    post_code: "52404",
    contact_phone_number: "712-370-8186",
    email: "darrellbalmeeer@omdiaco.com",
    username: "whoopmarbled",
    password: "HS^ACGix#Uj^",
    role: "USER",
    is_active: 0,
  },
  {
    first_name: "Luciano",
    last_name: "Maryam",
    address: "4483 Bailey Drive",
    post_code: "52627",
    contact_phone_number: "641-871-8269",
    email: "mumaruuuu@onlinecmail.com",
    username: "famousdepressed",
    password: "&la%^rVKLNLe",
    role: "USER",
    is_active: 1,
  },
];

exports.testUsers = testUsers;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const users = [];

  for (let i = 0; i < testUsers.length; ++i) {
    const hashedPassword = await hashPassword(testUsers[i].password);

    users.push({
      ...testUsers[i],
      password: hashedPassword,
    });
  }

  await knex("users").insert(users);
};
