require("../models/model");
const mongoose = require("mongoose");
const User = mongoose.model("user");

const findAllUser = async (req, res) => {
  const userList = await User.find();
  res.json(userList);
};

const createOneUser = async (req, res) => {
  const createdUser = await new User(req.body);
  await createdUser.save();
  res.json(createdUser);
};

const findOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findOne({ id });
    if (foundUser) {
      res.status(200).send(foundUser);
    } else {
      res.status(400).send("User is not found");
    }
  } catch (error) {
    next(error);
  }
};

const createOnePokemon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const createdPokemon = req.body;
    const foundUser = await User.findOne({ id });
    if (!foundUser) {
      res.status(400).send("User is not found");
    } else {
      await User.findOneAndUpdate(
        { id },
        { $push: { pokemonCollection: createdPokemon } }
      );
      res.status(200).send("Pokemon is successfully added");
    }
  } catch (error) {
    next(error);
  }
};

const deleteOnePokemon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPokemon = req.body;
    const foundUser = await User.findOne({ id });
    if (!foundUser) {
      res.status(400).send("User is not found");
    } else {
      const checkPokemon = foundUser.pokemonCollection.filter(
        element => element.name === deletedPokemon.name
      );
      if (checkPokemon.length <= 0) {
        res.status(422).send("Pokemon is not found");
      } else {
        await User.findOneAndUpdate(
          { id },
          { $pull: { pokemonCollection: deletedPokemon } }
        );
        res.status(200).send("Pokemon is successfully deleted");
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAllUser,
  createOneUser,
  findOneUser,
  createOnePokemon,
  deleteOnePokemon
};
