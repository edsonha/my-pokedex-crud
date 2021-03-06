const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

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

const userSchema = Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  pokemonCollection: [
    {
      name: { type: String, required: true },
      id: { type: Number, required: true }
    }
  ]
});

mongoose.model("pokemon", pokemonSchema);
mongoose.model("user", userSchema);
