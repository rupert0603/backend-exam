require("dotenv").config();

const app = require("./app");

const port = 8000;

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("There was an unhandled rejected promise", err);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
