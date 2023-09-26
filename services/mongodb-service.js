import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import processEnv from "../dotenv.js";

const MONGODB_URL = processEnv.MONGODB_URL;

let _DB = null;

let DATABASE_NAME = "iotdb";
let COLLECTION_NAME = "events";

async function init(databaseName = null, collectionName = null) {
  try {
    if (databaseName) DATABASE_NAME = databaseName;
    if (collectionName) COLLECTION_NAME = collectionName;

    // Check if the connection exists
    if (_DB && _DB.serverConfig && _DB.serverConfig.isConnected()) {
      console.info("Reusing existing connection");
      return _DB;
    }

    const client = await MongoClient.connect(MONGODB_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();

    const db = client.db(DATABASE_NAME);

    _DB = db;

    return _DB;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);

    throw error;
  }
}

async function connect(mongoClient, connectionString) {
  try {
    const client = await mongoClient.connect(connectionString);
    const db = client.db();

    console.log("Connected to MongoDB");

    _DB = db;

    return _DB;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);

    throw error;
  }
}

async function disconnect() {
  if (_DB) {
    await _DB.client.close();
    console.log("Disconnected from MongoDB");
  }
}

async function insert(collectionName = null, data) {
  const newEvent = await _DB.collection(collectionName).insertOne(data);

  console.debug("newEvent added: ", newEvent);

  return newEvent;
}

async function list({
  collectionName = null,
  query = {},
  sort = {},
  page = 0,
  limit = 10,
}) {
  const events = await _DB
    .collection(collectionName)
    .find(query ?? {})
    .sort({ _id: -1 })
    .limit(limit)
    .skip(page * limit)
    .toArray();

  console.debug("list events: ", events);

  return events;
}

async function getById(collectionName = null, id) {
  const event = await _DB
    .collection(collectionName)
    .findOne({ _id: new ObjectId(id) });

  console.debug("getbyId event: ", event);

  return event;
}

async function findOne(collectionName = null, query) {
  const event = await _DB.collection(collectionName).findOne(query);

  console.debug("findOne event: ", event);

  return event;
}

export default {
  init: init,
  insert: insert,
  list: list,
  findOne: findOne,
  getById: getById,
  connect: connect,
  disconnect: disconnect,
};
