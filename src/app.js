const express = require("express");
const pokemonRouter = require("./routes/pokemon.route");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.json("Hello world"));
app.use("/pokemon", pokemonRouter);

// ERROR HANDLER - good to have error handler
app.use((err, req, res, next) => {
  //Question funny message with this code
  console.log("error", err);
  res.sendStatus(500);
});

module.exports = app;
