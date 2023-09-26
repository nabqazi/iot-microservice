import express from "express";
import processEnv from "./dotenv.js";
import mqttService from "./services/mqtt-service.js";
import mongodbService from "./services/mongodb-service.js";
import IngestionService from "./services/ingestion-service.js";

const port = parseInt(processEnv.PORT) || 3000;

const app = express();

// initialize ingestion service and provide mqtt and db services
const ingestionService = new IngestionService();
await ingestionService.connect();

// app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("Success");
});

const server = app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

// hangle global exceptions
process.on("uncaughtException", (error) => {
  console.error(`Uncaught exception: ${error}`);

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
