# iot-microservice

This project is a sample IOT microservice, which uses globally hosted mqtt service and local MongoDB.
On startup, an ingestion service initialies mqtt and monogodb clients and start a mock producer at 5 sec interval
On message received, the mqtt client emits the message using node native event emitter.
The ingestion service listens to new msgs and validate, process and publish.


## Setup Node.js project

- npm init
- npm install express
- npm install --save-dev @babel/core @babel/cli @babel/preset-env (to use es7 features)
- npm install --save-dev mocha (for testing)
- npm install --save-dev supertest
- npm install mqtt ([Open Source MQTT Client](https://www.npmjs.com/package/mqtt))
- setup local mqtt producer using public broker
  - npm install mqtt -g
  - set env variable `MQTT_BROKER` with value `test.mosquitto.org`
  - mqtt pub -t 'iot/event' -h 'test.mosquitto.org' -m 'ping'
- setup mongodb locally
  - npm install mongodb
  - set env variable `MONGODB_URL` with value `mongodb://localhost:27017`
- runing mongodb and node server
  - docker-compose up -d
  - docker-compose down (to stop mongodb)
- access last 10 events in browser or postman
  - curl 'http://localhost:3000/events'

## TODOs

- [x] Setup Node.js project
- [x] Create a mock data generator
- [x] Define data validation rules
- [x] Log data events for processing
- [ ] Develop data anomaly detection algorithm
- [ ] Setup alerts to report anomalies in data
- [x] Define tests
