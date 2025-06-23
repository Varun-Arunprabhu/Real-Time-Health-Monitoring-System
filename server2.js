const { MongoClient } = require('mongodb');
const { setInterval } = require('timers');
const moment = require('moment');
const mqtt = require('mqtt');

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'health_Monitor';
const mongoClient = new MongoClient(url);

// MQTT broker details
const broker = {
  hostname: '8601e16f4eb74f42973b363418047712.s1.eu.hivemq.cloud',
  port: 8884,
  username: 'hivemq.webclient.1731248614617',
  password: 'I0los5d3?1FxCUDv*.J!'
};

const options = {
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  username: broker.username,
  password: broker.password,
  clientId: 'webclient_' + Math.random().toString(16).substr(2, 8)
};

const topicSteps = 'health/steps';
const topicHeartRate = 'health/heartRate';
const mqttClient = mqtt.connect(`wss://${broker.hostname}:${broker.port}/mqtt`, options);

// Connect to MongoDB
async function startMongoDB() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if unable to connect
  }
}

// MQTT event handlers
mqttClient.on('connect', function () {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe([topicSteps, topicHeartRate], function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics:', topicSteps, topicHeartRate);
    }
  });
});

let stepsData = '';
let heartRateData = '';

// Handle incoming MQTT messages
mqttClient.on('message', function (topic, message) {
  if (topic === topicSteps) {
    console.log('Received steps data:', message.toString());
    stepsData = message.toString();
  } else if (topic === topicHeartRate) {
    console.log('Received heart rate data:', message.toString());
    heartRateData = message.toString();
  }
});

// Function to update MongoDB with health data
async function updateHealthData(date, temperature, steps, bpm, spo2, caloriesBurnt) {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection('daily_metrics');

    const result = await collection.updateOne(
      { "date": date },
      {
        "$set": {
          "temperature": temperature,
          "steps": steps,
          "bpm": bpm,
          "spo2": spo2,
          "caloriesBurnt": caloriesBurnt
        },
        "$setOnInsert": { "date": date }
      },
      { upsert: true }
    );

    console.log(`Data for ${date} updated successfully!`);
  } catch (err) {
    console.error("Error updating data:", err);
  }
}

// Function to simulate reading data and updating MongoDB
function readFromSensors() {
  const temperature = (Math.random() * (100 - 96) + 96).toFixed(1);
  const steps = stepsData || 0;
  const bpm = heartRateData || 0;
  const spo2 = (Math.random() * (99 - 96) + 96).toFixed(1);
  const caloriesBurnt = (steps / 20).toFixed(2);
  const date = moment().format('YYYY-MM-DD');
  updateHealthData(date, temperature, steps, bpm, spo2, caloriesBurnt);
}

// Periodically read data and update MongoDB every minute
setInterval(readFromSensors, 1000);

// Start the MongoDB connection
startMongoDB();
