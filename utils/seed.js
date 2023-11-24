const connection = require('../config/connection');
const { Reaction, Thought, User } = require('../models');
const { generateRandomUser, generateRandomThought, generateRandomReaction } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Delete all prexisting collections
    let userCheck = await connection.db.listCollection({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    let thoughtCheck = await connection.db.listCollection({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }

    let reactionsCheck = await connection.db.listCollections({ name: 'reactions'}).toArray();
    if (reactionsCheck) {
        await connection.dropCollection('reactions');
    }

    // Create an empty array to hold the users in
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
    const thought2 = generateRandomThought(user.username);

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
});