const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //to remove Deprecation Warnings
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// const pokemonSchema = new mongoose.Schema({
const pokemonSchema = Schema({
  id: { type: Number, unique: true, required: true },
  name: {
    english: { type: String, required: true },
    japanese: String,
    chinese: String
  },
  type: { type: [String], required: true },
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    SpAttack: { type: Number, required: true },
    SpDefence: { type: Number, required: true },
    Speed: { type: Number, required: true }
  }
});

mongoose.model("pokemon", pokemonSchema);
