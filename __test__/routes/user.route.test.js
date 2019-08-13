const userData = require("../../mockData/user.data");
const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");

describe("User", () => {
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

  const insertUserDataIntoTestDB = async () => {
    const collection = db.collection("users");
    await collection.insertMany(userData);
  };

  beforeEach(async () => {
    await db.dropDatabase();
    await insertUserDataIntoTestDB();
  });

  const getUserData = index => userData.slice(index, index + 1)[0];

  describe("GET", () => {
    it("GET /users should find all users", async () => {
      const response = await request(app).get("/users");
      expect(response.body).toEqual(userData);
    });

    it("GET /users/:id should get the data (Peter id:1) from database", async () => {
      const user = getUserData(0);
      const collection = db.collection("users");

      const response = await request(app).get(`/users/${user.id}`);
      expect(response.status).toBe(200);
      const foundUser = await collection.findOne({ id: user.id });
      expect(response.body).toEqual(foundUser);
    });

    it("GET /users/:id should return `User is not found when invalid id is given", async () => {
      const response = await request(app).get(`/users/3`);
      expect(response.status).toBe(400);
      expect(response.text).toBe("User is not found");
    });
  });

  describe("POST", () => {
    it("POST /users should create one user", async () => {
      const collection = db.collection("users");
      const newUser = {
        id: 3,
        name: "John",
        pokemonCollection: [
          { name: "Bulbasaur", id: 1 },
          { name: "Squirtle", id: 7 }
        ]
      };

      const response = await request(app)
        .post(`/users`)
        .send(newUser)
        .set("Content-Type", "application/json");
      expect(response.status).toBe(200);
      const foundUser = await collection.findOne({ id: 3 });
      expect(foundUser).toMatchObject(newUser);
    });

    it("POST /users/:id should add one pokemon, Caterpie to Peter id:1", async () => {
      const user = getUserData(0);
      const collection = db.collection("users");

      const response = await request(app)
        .post(`/users/${user.id}`)
        .send({ name: "Caterpie", id: 10 })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Pokemon is successfully added");
      const foundUser = await collection.findOne({ id: user.id });
      expect(foundUser.pokemonCollection).toMatchObject([
        { name: "Squirtle", id: 7 },
        { name: "Charizard", id: 6 },
        { name: "Caterpie", id: 10 }
      ]);
    });

    it("POST /users/:id should return `User is not found` when invalid id is given", async () => {
      const response = await request(app)
        .post(`/users/3`)
        .send({ name: "Caterpie", id: 10 })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.text).toBe("User is not found");
    });
  });

  describe("DELETE", () => {
    it("DELETE /users/:id should delete one pokemon, Squirtle from Peter id:1", async () => {
      const user = getUserData(0);
      const collection = db.collection("users");

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .send({ name: "Squirtle" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Pokemon is successfully deleted");
      const foundUser = await collection.findOne({
        id: user.id
      });
      expect(foundUser.pokemonCollection).toEqual([
        { name: "Charizard", id: 6 }
      ]);
    });

    it("DELETE /users/:id should return `Pokemon is not found` when the pokemon cannot be found from Peter id:1 collection", async () => {
      const user = getUserData(0);
      const collection = db.collection("users");

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .send({ name: "Pikachu" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(422);
      expect(response.text).toBe("Pokemon is not found");
      const foundUser = await collection.findOne({
        id: user.id
      });
      expect(foundUser.pokemonCollection).toEqual([
        { name: "Squirtle", id: 7 },
        { name: "Charizard", id: 6 }
      ]);
    });

    it("DELETE /users/:id should return `User is not found` when invalid id is given", async () => {
      const response = await request(app)
        .delete(`/users/3`)
        .send({ name: "Squirtle" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.text).toBe("User is not found");
    });
  });
});
