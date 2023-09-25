import express from "express";
import processEnv from "./dotenv.js";
import mqttClient from "./services/mqtt-service.js";

const port = parseInt(processEnv.PORT) || 3000;

// initialize mqtt client
mqttClient.init();

const app = express();

app.get("/health", (req, res) => {
  res.send("Success");
});

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

export default app;
