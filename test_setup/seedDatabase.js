const { db } = require("../dbConnection");

const seedDatabase = async () => {
  await db.seed.run();
};

beforeEach(seedDatabase);
