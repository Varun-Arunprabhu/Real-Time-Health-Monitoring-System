#include <Wire.h>
#include <Adafruit_MLX90614.h>

// Create an instance of the MLX90614 sensor
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Array for storing temperature readings
const int readingCount = 30; // 1 reading per second, 30 readings for 30 seconds
float temperatureReadings[readingCount];
int readingIndex = 0;
bool readingsFilled = false;
unsigned long lastReadTime = 0;
const unsigned long readInterval = 1000; // 1 second interval

void setup() {
  Serial.begin(115200);
  
  // Initialize the sensor
  if (!mlx.begin()) {
    Serial.println("Error: Could not find MLX90614 sensor!");
    while (1) {
      delay(10);
    }
  }

  Serial.println("MLX90614 sensor ready.");
}

void loop() {
  unsigned long currentTime = millis();

  // Read temperature every 1 second
  if (currentTime - lastReadTime >= readInterval) {
    lastReadTime = currentTime;

    // Get the object (body) temperature in Celsius
    float objectTemp = mlx.readObjectTempC();
    
    // Store the reading in the array
    temperatureReadings[readingIndex++] = objectTemp;
    
    // Reset the index if it exceeds the array size
    if (readingIndex >= readingCount) {
      readingIndex = 0;
      readingsFilled = true; // Indicates that the array is fully filled at least once
    }
  }

  // Calculate and print the average temperature every 30 seconds
  if (readingsFilled && (currentTime - lastReadTime < readInterval)) {
    float sum = 0.0;
    for (int i = 0; i < readingCount; i++) {
      sum += temperatureReadings[i];
    }
    float averageTemp = sum / readingCount;
    float averageTempF = averageTemp * 9.0 / 5.0 + 32.0;

    Serial.print("Average Body Temperature for the last 30 seconds (F): ");
    Serial.println(averageTempF);

    // Clear readingsFilled flag to wait for the next 30 seconds batch
    readingsFilled = false;
  }

  // Delay to avoid continuous checking
  delay(50);
}
