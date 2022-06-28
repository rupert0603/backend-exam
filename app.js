const express = require("express");
const authRoute = require("./routes/auth_route");
const usersRoute = require("./routes/users_route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.use(function (req, res, next) {
  res.status(404).json({
    status: "FAILED",
    message: "Route not found",
  });
});

module.exports = app;
