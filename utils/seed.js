const mongoose = require('mongoose');
const { generateRandomUser, generateRandomThought, generateRandomReaction } = require('./data');
const User = require('../models/User');
const Reaction = require('../models/Reaction');
const Thought = require('../models/Thought');

mongoose.connect('mongodb://127.0.0.1:27017/studentsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    console.error('Connection Error', err)
});

mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
    mongoose.connection.dropDatabase();

    const users = [];
    const thoughts = [];
    const reactions = [];

    // Generate the random users
    for (let i = 0; i < 6; i++) {
        const newUser = generateRandomUser();
        const user = await User.create(newUser);
        users.push(user);

    // Generate thoughts for the users
    const thought1 = generateRandomThought(user.username);
    thought1.username = user.username;
    const thought2 = generateRandomThought(user.username);
    thought2.username = user.username;

    const newThought1 = await Thought.create(thought1);
    const newThought2 = await Thought.create(thought2);

    thoughts.push(newThought1, newThought2);

    // Generate random reactions for the thoughts
    const reaction1 = generateRandomReaction(user.username);
    const reaction2 = generateRandomReaction(user.username);

    const newReaction1 = await Reaction.create(reaction1);
    const newReaction2 = await Reaction.create(reaction2);

    reactions.push(newReaction1, newReaction2);

    // Link thoughts with reactions
    newThought1.reactions.push(newReaction1);
    newThought2.reactions.push(newReaction2);

    await newThought1.save();
    await newThought2.save();
    }

    console.table(users);
    console.table(thoughts);
    console.table(reactions);
    console.info('Seeding completed!');
    process.exit(0);
} catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
}
});