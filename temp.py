from pymongo import MongoClient
from datetime import datetime
import random  

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')  
db = client['health_Monitor'] 
collection = db['daily_metrics']  

def update_health_data(date, temperature, steps, bpm, spo2, calories_burnt):
    # Update the document for the current date
    collection.update_one(
        {"date": date},
        {
            "$set": {
                "temperature": temperature,
                "steps": steps,
                "bpm": bpm,
                "spo2": spo2,
                "caloriesBurnt": calories_burnt
            },
            "$setOnInsert": {"date": date} 
        },
        upsert=True  # Create a new document if it doesn't exist
    )
    print(f"Data for {date} updated successfully!")

# Simulate reading from Arduino (replace with actual data collection)
def read_from_arduino():
    # Simulated values; replace these with actual sensor readings
    temperature = round(random.uniform(96.0, 100.0), 1) 
    steps = random.randint(5000, 15000)  
    bpm = random.randint(60, 100) 
    spo2 = random.randint(95, 100)
    calories_burnt = random.randint(200, 600) 
    return temperature, steps, bpm, spo2, calories_burnt

# Main function to automate data update
def main():
    date = datetime.now().strftime('%Y-%m-%d')  # Get current date
    temperature, steps, bpm, spo2, calories_burnt = read_from_arduino()
    update_health_data(date, temperature, steps, bpm, spo2, calories_burnt)

if __name__ == "__main__":
    main()
