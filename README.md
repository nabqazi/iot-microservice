# iot-microservice

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
  - set up docker compose to run mongodb locally
  - docker-compose up -d

## TODOs

- [x] Setup Node.js project
- [x] Create a mock data generator
- [ ] Define data validation rules
- [ ] Log data events for processing
- [ ] Develop data anomaly detection algorithm
- [ ] Setup alerts to report anomalies in data
- [ ] Define tests to validate data processing
