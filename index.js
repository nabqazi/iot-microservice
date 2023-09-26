import express from "express";
import processEnv from "./dotenv.js";
import IngestionService from "./services/ingestion-service.js";
import mongodbService from "./services/mongodb-service.js";

const port = parseInt(processEnv.PORT) || 3000;

const app = express();

const ingestionService = new IngestionService();
await ingestionService.connect();

// app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("Success");
});

app.get("/events", async (req, res) => {
  try {
    await mongodbService.init();

    const events = await mongodbService.list({
      collectionName: "events-processed",
      sort: { _id: -1 },
      page: 0,
      limit: 10,
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events: ", error);

    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

// hangle global exceptions
process.on("uncaughtException", (error) => {
  console.error(`Uncaught exception: ${error}`);
  console.error(error.stack);
  // TODO: log error or send alerts
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT signal");
  await ingestionService.disconnect();
  server.close(() => {
    console.log("Server is shutting down");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM signal");
  await ingestionService.disconnect();
  server.close(() => {
    console.log("Server is shutting down");
    process.exit(0);
  });
});

export default app;
