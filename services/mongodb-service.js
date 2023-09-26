import { MongoClient } from "mongodb";
import processEnv from "../dotenv.js";

const MONGODB_URL = processEnv.MONGODB_URL;

let _DB = null;

let DATABASE_NAME = "iotdb";
let COLLECTION_NAME = "events";

async function init(databaseName, collectionName) {
  try {
    if (databaseName) DATABASE_NAME = databaseName;
    if (collectionName) COLLECTION_NAME = collectionName;

    // Check if the connection exists
    if (_DB && _DB.serverConfig && _DB.serverConfig.isConnected()) {
      console.info("Reusing existing connection");
      return _DB;
    }

    const client = await MongoClient.connect(MONGODB_URL, {
      autoReconnect: true,
    });

    client.connect(async (error) => {
      if (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        return;
      }
      console.log("Connected to MongoDB");

      const db = client.db(DATABASE_NAME);

      // Check if the collection exists
      const collections = await db
        .listCollections({ name: COLLECTION_NAME })
        .toArray();
      if (collections.length === 0) {
        await db.createCollection(COLLECTION_NAME);
        console.log(`${COLLECTION_NAME} collection created`);
      } else {
        console.log(`${COLLECTION_NAME} collection already exists`);
      }

      // set _DB to check if the connection exists
      _DB = db;

      return db;
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);

    throw error;
  }
}

export default {
  init: init,
};
