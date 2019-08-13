require("../models/model");
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
    if (foundPokemon) {
      res.json(foundPokemon);
    } else {
      res.status(400).send("Pokemon is not found");
    }
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPokemon = await Pokemon.findOneAndDelete({ id });
    if (deletedPokemon) {
      res.status(200).send(`${deletedPokemon.name.english} is deleted`);
    } else {
      res.status(400).send("Pokemon is not found");
    }
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updateFields = flattenObj(update);

    const updatedPokemon = await Pokemon.findOneAndUpdate({ id }, updateFields);

    if (updatedPokemon) {
      res.status(200).send("Update is successful");
    } else {
      res.status(400).send("Pokemon is not found");
    }
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
