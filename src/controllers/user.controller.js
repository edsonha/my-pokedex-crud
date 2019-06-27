require("../models/model");
const mongoose = require("mongoose");
const User = mongoose.model("user");

const findAllUser = async (req, res) => {
  const userList = await User.find();
  res.json(userList);
};

const createOnePokemon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const createdPokemon = req.body;
    await User.findOneAndUpdate(
      { id },
      { $push: { pokemonCollection: createdPokemon } }
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const findOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findOne({ id });
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
};

const deleteOnePokemon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPokemon = req.body;
    await User.findOneAndUpdate(
      { id },
      { $pull: { pokemonCollection: deletedPokemon } }
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAllUser,
  findOneUser,
  createOnePokemon,
  deleteOnePokemon
};
