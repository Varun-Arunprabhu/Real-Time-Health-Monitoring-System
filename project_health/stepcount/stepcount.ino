#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

int steps = 0;
float prevAccelMagnitude = 0.0;
unsigned long lastStepTime = 0;
const int stepDelay = 300; // Minimum time (in ms) between steps to filter out noise

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed!");
    while (1);
  }
  Serial.println("MPU6050 connection successful");
}

void loop() {
  int16_t axRaw, ayRaw, azRaw;
  mpu.getAcceleration(&axRaw, &ayRaw, &azRaw);
  
  // Convert raw acceleration to G force
  float ax = axRaw / 16384.0;
  float ay = ayRaw / 16384.0;
  float az = azRaw / 16384.0;
  
  // Apply a simple low-pass filter to reduce noise
  float alpha = 0.8;
  float accelMagnitude = sqrt(ax * ax + ay * ay + az * az);
  accelMagnitude = alpha * prevAccelMagnitude + (1 - alpha) * accelMagnitude; 
  prevAccelMagnitude = accelMagnitude;

  // Lower threshold for step detection
  float walkThreshold = 1.2; // Experiment with this value

  // Step detection logic
  unsigned long currentTime = millis();
  if (accelMagnitude > walkThreshold && (currentTime - lastStepTime) > stepDelay) {
    steps++;
    lastStepTime = currentTime;
    Serial.print("Step detected! Total Steps: ");
    Serial.println(steps);
  }

  delay(50); // Adjust delay for smoother calculations
}
