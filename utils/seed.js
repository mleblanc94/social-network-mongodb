const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('../models/User');
const Thought = require('../models/Thought');
const Reaction = require('../models/Reaction');
const { userData, thoughtData, reactionData } = require('./data');

// Your database connection URI
const DB_URI = 'mongodb://127.0.0.1:27017/studentsDB';

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to the database
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clear existing data
    await Promise.all([User.deleteMany(), Thought.deleteMany(), Reaction.deleteMany()]);

    // Seed users
    const createdUsers = await User.insertMany(userData);

    // Seed thoughts without association to users
    const createThoughts = await Thought.insertMany(thoughtData);

// Map thoughtData to assign thought references to users
createdUsers.forEach(user => {
  thoughtData.forEach(async thought => {
    if (thought.username === user.username) {
      // Find the thought created for this user
      const userThought = createThoughts.find(
        createdThought => createdThought.username === user.username
      );
      user.thoughts.push(userThought._id); // Assigning thought references to user
      await user.save(); // Save user with updates
    }
  });
});

    // Map thought Data to include user references
    const thoughtsWithUsers = thoughtData.map(thought => {
      const user = createdUsers.find(user => user.username === thought.username);
      thought.username = user._id;
      return thought;
    });

    // Seed the thoughts data
    const createdThoughts = await Thought.insertMany(thoughtsWithUsers);

    // Map reactionData to include thought references
    const reactionsWithThoughts = reactionData.map(reaction => {
      const thought = createdThoughts[Math.floor(Math.random() * createdThoughts.length)];
      reaction.thought = thought._id;
      return reaction;
    });

    // Seed reactions
    await Reaction.insertMany(reactionsWithThoughts);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Seed the database
seedDatabase();