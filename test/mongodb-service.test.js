import assert from "assert";
import { MongoClient } from "mongodb";
import mongodbService from "../services/mongodb-service.js";

describe("mongodb-service", () => {
  let _db;

  before(async () => {
    const connectionString = "mongodb://localhost:27017";
    const db = await mongodbService.connect(
      MongoClient,
      "mongodb://localhost:27017/test"
    );

    _db = db;
  });

  after(async () => {
    await mongodbService.disconnect();
  });

  before(async () => {
    await _db.collection("events").deleteMany({});
    await _db.collection("events-processed").deleteMany({});
  });

  describe("connect", () => {
    it("should connect to the MongoDB server with test db", async () => {
      const result = await mongodbService.connect(
        MongoClient,
        "mongodb://localhost:27017/test"
      );

      assert.strictEqual(result.databaseName, "test");
    });
  });

  describe("insert", () => {
    it("should insert a new event into the database", async () => {
      const data = {
        timestamp: new Date().toISOString(),
        eventId: Date.now(),
      };
      const result = await mongodbService.insert("events", data);
      assert.strictEqual(result.acknowledged, true);
    });
  });

  describe("list", () => {
    it("should return a list of events from the database", async () => {
      const result = await mongodbService.list({
        collectionName: "events",
      });
      console.log("result: ", result);
      assert.strictEqual(result.length > 0, true);
    });
  });
});
