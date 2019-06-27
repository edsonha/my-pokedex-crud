const express = require("express");
require("./utils/db");
const pokemonRouter = require("./routes/pokemon.route");
const userRouter = require("./routes/user.route");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.json("Hello world"));
app.use("/pokemon", pokemonRouter);
app.use("/users", userRouter);

// ERROR HANDLER - good to have error handler
app.use((err, req, res, next) => {
  console.log("error", err);
  res.sendStatus(500);
});

module.exports = app;
