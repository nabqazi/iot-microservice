FROM node:alpine

WORKDIR /app

# TODO: exclude unnecessary files
COPY . /app 

RUN npm install

EXPOSE 3000

ENV MQTT_BROKER=mqtt://test.mosquitto.org
ENV MONGODB_URL=mongodb://mongodb:27017

CMD ["npm", "start"]