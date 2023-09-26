import mqtt from "mqtt";
import EventEmitter from "events";
import processEnv from "../dotenv.js";

const MQTT_SERVICE_URL = processEnv.MQTT_BROKER;
let TOPIC = "nabqazi";

// TODO: Add logic to init eventId
let EVENT_ID = 1;

let _MQTT_CLIENT = null;

let onMessageCallback = null;

console.debug("mqttServiceUrl: ", MQTT_SERVICE_URL);

function init({ topic = null, onMessage = null, eventEmitter = null }) {
  try {
    if (topic) TOPIC = topic;
    if (onMessage) onMessageCallback = onMessage;

    // Check if the connection exists
    if (_MQTT_CLIENT && _MQTT_CLIENT.connected) {
      console.info("Reusing existing connection");
      return _MQTT_CLIENT;
    }

    const client = mqtt.connect(MQTT_SERVICE_URL);

    client.on("connect", () => {
      console.log("Connected to Mosquitto broker");

      client.subscribe(TOPIC);
      console.log(`Listening on topic: ${TOPIC}`);
    });

    client.on("message", (TOPIC, message) => {
      console.log(
        `--------> Received message: topic:${TOPIC}, message:${message}`
      );

      // TODO: Add logic to handle message
      if (onMessageCallback) onMessageCallback(message);
    });

    // set _MQTT_CLIENT to check if the connection exists
    _MQTT_CLIENT = client;

    return client;
  } catch (error) {
    console.error("Error connecting to Mosquitto broker: ", error);

    throw error;
  }
}

function publishMessage(message = null) {
  try {
    const msg = JSON.stringify(
      message ?? {
        timestamp: new Date().toISOString(),
        eventId: EVENT_ID,
      }
    );

    _MQTT_CLIENT.publish(TOPIC, msg, (error) => {
      if (error) {
        console.error(`Error publishing message: ${error}`);
      } else {
        console.log(`<------- Message published to topic ${TOPIC}: ${msg}`);

        // client.end();
      }
    });
    EVENT_ID++;
  } catch (error) {
    console.error("Error publishing to Mosquitto broker: ", error);

    throw error;
  }
}

export default {
  init: init,
  initProducer: publishMessage,
};
