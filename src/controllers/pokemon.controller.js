require("../models/pokemon.model");
const mongoose = require("mongoose");
const Pokemon = mongoose.model("pokemon");
const { flattenObj } = require("../utils/objectHelper");

const findAll = async (req, res) => {
  const pokemonList = await Pokemon.find();
  res.json(pokemonList);
};

const createOne = async (req, res, next) => {
  const createdPokemon = await new Pokemon(req.body);
  await createdPokemon.save();
  res.json(createdPokemon);
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundPokemon = await Pokemon.findOne({ id });
    res.json(foundPokemon); //There is no need to sendStatus(200) because .json and .sendStatus(200) have the same sending mechanism
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Pokemon.findOneAndDelete({ id });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updateFields = flattenObj(update);

    await Pokemon.findOneAndUpdate({ id }, updateFields);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  findOne,
  createOne,
  deleteOne,
  updateOne
};
