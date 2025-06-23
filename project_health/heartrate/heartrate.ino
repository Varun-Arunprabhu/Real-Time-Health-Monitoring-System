#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

const byte RATE_SIZE = 4; // Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE];    // Array of heart rates
byte rateSpot = 0;
long lastBeat = 0;        // Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;

// Variables for 30-second window
unsigned long startTime = 0;
unsigned long currentTime;
int totalBPM = 0;
int bpmCount = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing...");

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) // Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup();                        // Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A);     // Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0);      // Turn off Green LED

  startTime = millis(); // Initialize timer
}

void loop()
{
  long irValue = particleSensor.getIR();
  currentTime = millis();

  if (checkForBeat(irValue) == true)
  {
    // We sensed a beat!
    long delta = currentTime - lastBeat;
    lastBeat = currentTime;

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; // Store this reading in the array
      rateSpot %= RATE_SIZE;                    // Wrap variable

      // Take average of readings
      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;

      // Accumulate BPM for 30 seconds
      totalBPM += beatAvg;
      bpmCount++;
    }
  }

  if (currentTime - startTime >= 30000) // 30 seconds have passed
  {
    // Calculate and print average BPM for the 30-second window
    if (bpmCount > 0)
    {
      int avgBPM30Sec = totalBPM / bpmCount;
      Serial.print("Average BPM over the last 30 seconds: ");
      Serial.println(avgBPM30Sec);
    }
    else
    {
      Serial.println("No valid BPM detected in the last 30 seconds.");
    }

    // Reset the timer and counters
    startTime = currentTime;
    totalBPM = 0;
    bpmCount = 0;
  }
}
