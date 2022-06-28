module.exports = {
  testEnvironment: "node",
  globalSetup: "<rootDir>/test_setup/migrateDatabase.js",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: [
    "<rootDir>/test_setup/truncateRows.js",
    "<rootDir>/test_setup/seedDatabase.js",
    "<rootDir>/test_setup/disconnectFromDb.js",
  ],
};
