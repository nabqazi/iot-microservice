import mqttService from "./mqtt-service.js";
import mongodbService from "./mongodb-service.js";
import EventEmitter from "events";

class IngestionService {
  dbClient;
  mqttClient;
  eventEmitter;
  producerInterval;

  valitationEvent = "validate-event";

  constructor() {
    this.mqttClient = null;
    this.dbClient = null;
    this.eventEmitter = null;
    this.producerInterval = null;
  }

  async connect() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on(this.valitationEvent, this.validate.bind(this));

    // pass the emitter to mqtt service to receive validate events broadcast
    this.mqttClient = await mqttService.init({
      onMessage: (message) => {
        // TODO: publish node emit event or take callback function to handle message
        const broadcast = this.eventEmitter.emit(this.valitationEvent, message);
        console.log("broadcast: ", broadcast);
      },
    });

    this.dbClient = await mongodbService.init();

    // enable to publish message every 5 seconds
    this.producerInterval = setInterval(() => mqttService.initProducer(), 5000);
  }

  async validate(eventData) {
    try {
      const event = JSON.parse(eventData);

      // perform data validations here
      console.debug("validate event data: ", event, this.eventEmitter);

      // TODO: add validation logic here
      const isDataValid = true; // someFunc(event);
      if (!isDataValid) this.alert("Invalid data received.");

      const insertRes = await mongodbService.insert("events", event);
      if (insertRes && insertRes.acknowledged) {
        console.log("Event inserted successfully");

        this.processEvent(insertRes.insertedId);
      }
    } catch (error) {
      console.error("Error validating event: ", error);

      throw error;
    }
  }

  async processEvent(eventId) {
    try {
      const event = await mongodbService.findOne("events", { _id: eventId });

      console.debug("process event data: ", event);

      // TODO: add processing logic here
      const { _id, ...rawEventData } = event; // someFunc(event);
      const processedEvent = {
        ...rawEventData,
        rawEventId: _id,
        processedAt: new Date(),
      };
      const insertRes = await mongodbService.insert(
        "events-processed",
        processedEvent
      );
      if (insertRes && insertRes.acknowledged) {
        console.log("Event processed successfully");

        this.publishEvent(insertRes.insertedId);
      }
    } catch (error) {
      console.error("Error processing event: ", error);

      throw error;
    }
  }

  async publishEvent(eventId) {
    try {
      const event = await mongodbService.findOne("events-processed", {
        _id: eventId,
      });

      console.debug("publish event data: ", event);

      if (event) {
        console.log("Event published successfully");
      }
      // TODO: add publish logic here

      // TODO: update in redis

      // TODO: broadcast to connected clients
    } catch (error) {
      console.error("Error publishing event: ", error);

      throw error;
    }
  }

  async alert(message) {
    console.log("alert: ", message);
  }

  async disconnect() {
    if (this.producerInterval) {
      clearInterval(this.producerInterval);
      console.log("Stopped producer interval");
    }

    if (this.mqttClient) {
      await this.mqttClient.end();
      console.log("Disconnected from MQTT broker");
    }

    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log("Disconnected from MongoDB");
    }

    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners(this.valitationEvent);
      console.log("Disposed event emitter");
    }
  }
}

export default IngestionService;
