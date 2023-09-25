import mqtt from "mqtt";
import processEnv from "../dotenv.js";

const mqttServiceUrl = processEnv.MQTT_BROKER;
const topic = "nabqazi";
var eventId = 1;

console.debug("mqttServiceUrl: ", mqttServiceUrl);

function init() {
  try {
    const client = mqtt.connect(mqttServiceUrl);

    client.on("connect", () => {
      console.log("Connected to Mosquitto broker");
      client.subscribe(topic);
      console.log(`Listening on topic: ${topic}`);
    });

    client.on("message", (topic, message) => {
      console.log(
        `${new Date().toISOString()}: Received message: topic:${topic}, message:${message}`
      );

      // TODO: Add logic to handle message
    });

    setInterval(() => publishMessage(client), 1000);

    return client;
  } catch (error) {
    console.error("Error connecting to Mosquitto broker: ", error);
  }
}

function publishMessage(client) {
  try {
    const msg = JSON.stringify({
      timestamp: new Date().toISOString(),
      eventId,
    });

    client.publish(topic, msg, (error) => {
      if (error) {
        console.error(`Error publishing message: ${error}`);
      } else {
        console.log(`Message published to topic ${topic}: ${msg}`);

        // client.end();
      }
    });
    eventId++;
  } catch (error) {
    console.error("Error publishing to Mosquitto broker: ", error);
  }
}

export default {
  init: init,
};
