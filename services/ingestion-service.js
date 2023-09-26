import mqttService from "./mqtt-service.js";
import mongodbService from "./mongodb-service.js";

class IngestionService {
  dbClient;
  mqttClient;

  constructor() {
    this.mqttClient = null;
    this.dbClient = null;
  }

  async connect() {
    this.mqttClient = await mqttService.init();
    // this.dbClient = await mongodbService.init();

    // enable to publish message every 5 seconds
    setInterval(() => mqttService.initProducer(), 5000);
  }

  async validate(eventData) {
    // perform data validations here

    // throw unimplemeted exception
    throw new Error("Not implemented");
  }

  async disconnect() {
    if (this.mqttClient) {
      await this.mqttClient.end();
      console.log("Disconnected from MQTT broker");
    }

    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log("Disconnected from MongoDB");
    }
  }
}

export default IngestionService;
