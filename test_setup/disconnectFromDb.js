const { closeConnection } = require("../dbConnection");

afterAll(closeConnection);
