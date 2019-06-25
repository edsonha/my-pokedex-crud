const pokemonData = require("../../data/pokemon.data");
const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
require("../../src/utils/db");

describe("Pokemon", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];

    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });

    // console.log(global.__MONGO_URI__);
    // console.log(dbName);
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  it("GET / should return a hello message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual("Hello world");
  });

  it("GET /pokemon should find all pokemon", async () => {
    const collection = db.collection("pokemons"); //Question: Why I cannot use ("pokemon")? Ans1: when mongoose create the model. mongoose.model(‘pokemon’, pokemonSchema). mongoose will ask mongodb to create a collection with the plural form and all small caps of ‘pokemon’ thus ‘pokemons’
    await collection.insertMany(pokemonData);

    const response = await request(app).get("/pokemon");
    expect(response.body).toMatchObject(pokemonData);
  });

  it("POST /pokemon should create a new pokemon", async () => {
    const collection = db.collection("pokemons");
    await collection.insertMany(pokemonData);
    const newPokemon = {
      id: 1,
      name: {
        english: "Bulbasaur",
        japanese: "フシギダネ",
        chinese: "妙蛙种子"
      },
      type: ["Grass", "Poison"],
      base: {
        HP: 45,
        Attack: 49,
        Defense: 49,
        SpAttack: 65,
        SpDefence: 65,
        Speed: 45
      }
    };
    const response = await request(app)
      .post(`/pokemon`)
      .send(newPokemon)
      .set("Content-Type", "application/json");
    expect(response.status).toEqual(200);
    const foundPokemon = await collection.findOne({ id: 1 });
    // console.log("create", response.body);
    // console.log("found", foundPokemon);
    expect(foundPokemon).toMatchObject(newPokemon); //Why I cannot test against response.body because of different UUID
    // expect(foundPokemon.name.english).toEqual("Bulbasaur");
  });

  const getPokemonData = index => pokemonData.slice(index, index + 1)[0];

  it("GET /pokemon/:id should get the data (Squirtle id:7) from database", async () => {
    const pokemon = getPokemonData(0);
    const collection = db.collection("pokemons");
    await collection.insertMany(pokemonData);

    const response = await request(app).get(`/pokemon/${pokemon.id}`);

    expect(response.status).toEqual(200);
    const foundPokemon = await collection.findOne({ id: pokemon.id });
    expect(foundPokemon).toMatchObject(response.body);
    // console.log(foundPokemon);
    // console.log(response.body);
  });

  it("DELETE /pokemon/:id should delete the data (Squirtle id:7) from database", async () => {
    const pokemon = getPokemonData(0);
    const collection = db.collection("pokemons");
    await collection.insertMany(pokemonData);

    const response = await request(app).delete(`/pokemon/${pokemon.id}`);

    expect(response.status).toEqual(200);
    // console.log(response.body);
    const deletedPokemon = await collection.findOne({ id: pokemon.id });
    expect(deletedPokemon).toBeFalsy();
  });

  it("PUT /pokemon/:id should modify the data (Squirtle id:7) from database", async () => {
    const pokemon = getPokemonData(0);
    const collection = db.collection("pokemons");
    await collection.insertMany(pokemonData);
    const updatedFields = {
      name: {
        english: "John Smith"
      }
    };

    const response = await request(app)
      .put(`/pokemon/${pokemon.id}`)
      .send(updatedFields)
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    const dataFromDb = await collection.findOne({ id: pokemon.id });
    expect(dataFromDb.name.english).toEqual(updatedFields.name.english);
  });
});
