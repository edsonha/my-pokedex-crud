const pokemonData = require("../../mockData/pokemon.data");
const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");

describe("Pokemon", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];

    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  const insertPokemonDataIntoTestDB = async () => {
    const collection = db.collection("pokemons");
    await collection.insertMany(pokemonData);
  };

  beforeEach(async () => {
    await db.dropDatabase();
    await insertPokemonDataIntoTestDB();
  });

  const getPokemonData = index => pokemonData.slice(index, index + 1)[0];

  describe("GET", () => {
    it("GET / should return a hello message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toBe("Hello world");
    });

    it("GET /pokemon should find all pokemon", async () => {
      const response = await request(app).get("/pokemon");
      expect(response.body).toEqual(pokemonData);
    });

    it("GET /pokemon/:id should get the data (Squirtle id:7) from database", async () => {
      const pokemon = getPokemonData(0);
      const collection = db.collection("pokemons");

      const response = await request(app).get(`/pokemon/${pokemon.id}`);

      expect(response.status).toBe(200);
      const foundPokemon = await collection.findOne({ id: pokemon.id });
      expect(response.body).toEqual(foundPokemon);
    });

    it("GET /pokemon/:id should return 'Pokemon is not found' if invalid id is given", async () => {
      const response = await request(app).get(`/pokemon/2`);
      expect(response.status).toBe(400);
      expect(response.text).toBe("Pokemon is not found");
    });
  });

  describe("POST", () => {
    it("POST /pokemon should create a new pokemon", async () => {
      const collection = db.collection("pokemons");
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
      expect(response.status).toBe(200);
      const foundPokemon = await collection.findOne({ id: 1 });
      expect(foundPokemon).toMatchObject(newPokemon);
    });
  });

  describe("DELETE", () => {
    it("DELETE /pokemon/:id should delete the data (Squirtle id:7) from database", async () => {
      const pokemon = getPokemonData(0);
      const collection = db.collection("pokemons");

      const response = await request(app).delete(`/pokemon/${pokemon.id}`);

      expect(response.status).toBe(200);
      const deletedPokemon = await collection.findOne({ id: pokemon.id });
      expect(deletedPokemon).toBeFalsy();
    });

    it("DELETE /pokemon/:id should return `Pokemon is not found` when given invalid id", async () => {
      const response = await request(app).delete(`/pokemon/2`);

      expect(response.status).toBe(400);
      expect(response.text).toBe("Pokemon is not found");
    });
  });

  describe("PUT", () => {
    it("PUT /pokemon/:id should modify the data (Squirtle id:7) from database", async () => {
      const pokemon = getPokemonData(0);
      const collection = db.collection("pokemons");

      const updatedFields = {
        name: {
          english: "John Smith"
        }
      };

      const response = await request(app)
        .put(`/pokemon/${pokemon.id}`)
        .send(updatedFields)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      const dataFromDb = await collection.findOne({ id: pokemon.id });
      expect(dataFromDb.name.english).toBe(updatedFields.name.english);
    });

    it("PUT /pokemon/:id should return `Pokemon is not found` if invalid id is given", async () => {
      const updatedFields = {
        name: {
          english: "John Smith"
        }
      };

      const response = await request(app)
        .put(`/pokemon/2`)
        .send(updatedFields)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.text).toBe("Pokemon is not found");
    });
  });
});
