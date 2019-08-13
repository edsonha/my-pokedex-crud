const userData = require("../../mockData/user.data");
const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
// require("../../src/utils/db");

describe("User", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];

    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });

    // console.log(global.__MONGO_URI__);
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

  it("GET /users should find all users", async () => {
    const collection = db.collection("users");
    await collection.insertMany(userData);

    const response = await request(app).get("/users");
    expect(response.body).toEqual(userData);
  });

  const getUserData = index => userData.slice(index, index + 1)[0];

  it("GET /users/:id should get the data (Peter id:1) from database", async () => {
    const user = getUserData(0);
    const collection = db.collection("users");
    await collection.insertMany(userData);

    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toEqual(200);
    const foundUser = await collection.findOne({ id: user.id });
    expect(response.body).toEqual(foundUser);
  });

  it("POST /users/:id should add one pokemon, Caterpie to Peter id:1", async () => {
    const user = getUserData(0);
    const collection = db.collection("users");
    await collection.insertMany(userData);

    const response = await request(app)
      .post(`/users/${user.id}`)
      .send({ name: "Caterpie", id: 10 })
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    const addingUserCollection = await collection.findOne({ id: user.id });
    expect(addingUserCollection.pokemonCollection).toMatchObject([
      { name: "Squirtle", id: 7 },
      { name: "Charizard", id: 6 },
      { name: "Caterpie", id: 10 }
    ]);
  });

  it("DELETE /users/:id should delete one pokemon, Squirtle from Peter id:1", async () => {
    const user = getUserData(0);
    const collection = db.collection("users");
    await collection.insertMany(userData);

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .send({ name: "Squirtle" })
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    const decreasingUserCollection = await collection.findOne({ id: user.id });
    expect(decreasingUserCollection.pokemonCollection).toEqual([
      {
        name: "Charizard",
        id: 6
      }
    ]);
  });
});
