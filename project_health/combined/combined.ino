#include <Wire.h>
#include <MPU6050.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <Adafruit_MLX90614.h>

#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <WiFi.h>

// Wi-Fi credentials
const char* ssid = "VARUN'S PHONE";
const char* wifi_password = "VARUN2004";

// MQTT broker details
const char* mqtt_server = "8601e16f4eb74f42973b363418047712.s1.eu.hivemq.cloud";
const int mqtt_port = 8883; 
const char* mqtt_user = "hivemq.webclient.1731248614617"; 
const char* mqtt_password = "I0los5d3?1FxCUDv*.J!"; 
const char* stepsTopic = "health/steps";
const char* heartRateTopic = "health/heartRate";
const char* temperatureTopic = "health/temperature";

// Create a WiFiClientSecure instance
WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup_wifi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connected!");
}

void reconnect() {
  espClient.setInsecure();

  while (!client.connected()) {
    Serial.print("Connecting to MQTT broker...");
    if (client.connect("ESP8266Client", mqtt_user, mqtt_password)) {
      Serial.println("Connected!");
    } else {
      Serial.print("Failed. Error code: ");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

// Create instances of the sensors
MPU6050 mpu;
MAX30105 particleSensor;
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Variables for step counting
int steps = 0;
float prevAccelMagnitude = 0.0;
unsigned long lastStepTime = 0;
const int stepDelay = 300; // Minimum time (in ms) between steps to filter out noise
unsigned long lastStepReadTime = 0;

// Variables for heart rate
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;
unsigned long hrStartTime = 0;
unsigned long hrCurrentTime;
int totalBPM = 0;
int bpmCount = 0;

// Variables for body temperature
const int readingCount = 30; // 1 reading per second, 30 readings for 30 seconds
float temperatureReadings[readingCount];
int readingIndex = 0;
bool readingsFilled = false;
unsigned long lastTempReadTime = 0;
const unsigned long tempReadInterval = 1000; // 1 second interval

void setup() {
  Serial.begin(115200);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  // Initialize MPU6050
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed!");
    while (1);
  }
  Serial.println("MPU6050 connection successful");

  // Initialize MAX30105
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
  hrStartTime = millis();

  // Initialize MLX90614
  if (!mlx.begin()) {
    Serial.println("Error: Could not find MLX90614 sensor!");
    while (1);
  }
  Serial.println("MLX90614 sensor ready.");
}

void loop() {
  unsigned long currentTime = millis();
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Step Counting Logic (read every 50ms)
  if (currentTime - lastStepReadTime >= 50) {
    lastStepReadTime = currentTime;
    int16_t axRaw, ayRaw, azRaw;
    mpu.getAcceleration(&axRaw, &ayRaw, &azRaw);
    float ax = axRaw / 16384.0;
    float ay = ayRaw / 16384.0;
    float az = azRaw / 16384.0;
    float alpha = 0.8;
    float accelMagnitude = sqrt(ax * ax + ay * ay + az * az);
    accelMagnitude = alpha * prevAccelMagnitude + (1 - alpha) * accelMagnitude;
    prevAccelMagnitude = accelMagnitude;

    if (accelMagnitude > 1.2 && (currentTime - lastStepTime) > stepDelay) {
      steps++;
      lastStepTime = currentTime;
      Serial.print("Step detected! Total Steps: ");
      Serial.println(steps);
      String stepsMsg = String(steps);
      client.publish(stepsTopic, stepsMsg.c_str());
    }
  }

  // Heart Rate Logic (keep the original logic from your code)
  long irValue = particleSensor.getIR();
  hrCurrentTime = millis();
  if (checkForBeat(irValue) == true) {
    long delta = hrCurrentTime - lastBeat;
    lastBeat = hrCurrentTime;
    beatsPerMinute = 60 / (delta / 1000.0);
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE;
      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
      totalBPM += beatAvg;
      bpmCount++;
    }
  }
  if (hrCurrentTime - hrStartTime >= 30000) {
    if (bpmCount > 0) {
      int avgBPM30Sec = totalBPM / bpmCount;
      Serial.print("Average BPM over the last 30 seconds: ");
      Serial.println(avgBPM30Sec);
      String heartRateMsg = String(avgBPM30Sec);
      client.publish(heartRateTopic, heartRateMsg.c_str());
    } else {
      Serial.println("No valid BPM detected in the last 30 seconds.");
    }
    hrStartTime = hrCurrentTime;
    totalBPM = 0;
    bpmCount = 0;
  }

  // Body Temperature Logic (read every 1000ms and calculate average for 30s)
  if (currentTime - lastTempReadTime >= tempReadInterval) {
    lastTempReadTime = currentTime;
    float objectTemp = mlx.readObjectTempC();
    
    // Store the reading in the array
    temperatureReadings[readingIndex++] = objectTemp;
    
    // Reset the index if it exceeds the array size
    if (readingIndex >= readingCount) {
      readingIndex = 0;
      readingsFilled = true; // Indicates that the array is fully filled at least once
    }
  }

  if (readingsFilled && (currentTime - lastTempReadTime < tempReadInterval)) {
    float sum = 0.0;
    for (int i = 0; i < readingCount; i++) {
      sum += temperatureReadings[i];
    }
    float averageTemp = sum / readingCount;
    float averageTempF = averageTemp * 9.0 / 5.0 + 32.0;

    Serial.print("Average Body Temperature for the last 30 seconds (F): ");
    Serial.println(averageTempF);
    String tempMsg = String(averageTempF);
    client.publish(temperatureTopic, tempMsg.c_str());

    // Clear readingsFilled flag to wait for the next 30 seconds batch
    readingsFilled = false;
  }
}
