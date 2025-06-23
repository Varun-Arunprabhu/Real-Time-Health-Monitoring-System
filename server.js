const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const bodyParser = require('body-parser'); // To parse JSON bodies
const mongoose = require('mongoose');

let globalemail


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Enable JSON parsing

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

  // Goal schema and model
  const goalSchema = new mongoose.Schema({
    emailid : String,
    dailyGoals: {
      steps: Number,
      calories: Number,
      yoga: Number,
      meditation: Number
    },
    monthlyGoals: {
      steps: Number,
      calories: Number
    }
  });

  const Goal = mongoose.model('Goal', goalSchema);

// Route to handle user signup
app.post('/signup', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('health_Monitor');
    const collection = db.collection('users');

    const { email, username, weight, height, age, location, password, profilePicture } = req.body;

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user data in the collection
    const newUser = {
      email,
      username,
      weight,
      height,
      age,
      location,
      password: hashedPassword,
      profilePicture
    };

    await collection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('health_Monitor');
    const collection = db.collection('users');

    const { email, password } = req.body;

    // Check if the user exists
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the input password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    globalemail=email;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Existing route for fetching health data
app.get('/health-data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('health_Monitor');
    const collection = db.collection('daily_metrics');
    const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const document = await collection.findOne({ date: currentDate });
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: 'No data found for today' });
    }
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

app.post('/goals', async (req, res) => {
  mongoose.connect('mongodb://localhost:27017/health_Monitor')
    .catch((error) => console.error('MongoDB connection error:', error));

  try {
    const { dailyGoals, monthlyGoals } = req.body;
    const emailid = globalemail;

    // Update the existing goal or create a new one if it doesn't exist
    const updatedGoal = await Goal.findOneAndUpdate(
      { emailid: emailid }, // Search by emailid
      { 
        $set: {
          dailyGoals, // Update dailyGoals
          monthlyGoals // Update monthlyGoals
        }
      },
      { 
        new: true,  // Return the updated document
        upsert: true // If no document is found, create a new one
      });

    // Send response
    res.status(201).json({ message: 'Goals saved successfully', goal: updatedGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving goals', error });
  }
});


app.get('/details', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('health_Monitor');
    const collection = db.collection('users');

    const document = await collection.findOne({email: globalemail});
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: 'No data found for today' });
    }
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/goaldetails', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('health_Monitor');
    const collection = db.collection('goals');

    const document = await collection.findOne({emailid: globalemail});
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: 'No data found for today' });
    }
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});