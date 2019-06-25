const express = require("express");
const pokemonRouter = express.Router();
const Controller = require("../controllers/pokemon.controller");

pokemonRouter.get("/", Controller.findAll);
pokemonRouter.post("/", Controller.createOne);

pokemonRouter.get("/:id", Controller.findOne);
pokemonRouter.put("/:id", Controller.updateOne);
pokemonRouter.delete("/:id", Controller.deleteOne);

module.exports = pokemonRouter;
