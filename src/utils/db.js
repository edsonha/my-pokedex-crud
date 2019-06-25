const mongoose = require("mongoose");

const dbURI = global.__MONGO_URI__ || "mongodb://localhost:27017/poketest";
// console.log("dbURI is ", dbURI); //will connect to poketest - jest database

mongoose.connect(dbURI, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to mongodb");
});
