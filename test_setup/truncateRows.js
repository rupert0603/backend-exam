const { db } = require("../dbConnection");

const truncateRows = async () => {
  await db("users").del();
};

beforeEach(truncateRows);
