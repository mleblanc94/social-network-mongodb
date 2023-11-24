const { types, Types } = require('mongoose');
const { getMaxListeners } = require('../models/Reaction');

const usernames = [
    'mleblanc94',
    'tsmith87',
    'fpriaaw45',
    'skippy57',
    'mjohnson82',
    'blakemert55',
    'kadams3',
    'tbine2',
    'daaaweee32',
    'tcline55',
    'boootle22',
    'aawwee99'
];

const emails = [
    'mleblanc94@gmail.com',
    'tsmith87@gmail.com',
    'fprriaaww45@gmail.com',
    'skippy57@gmail.com',
    'mjohnson82@gmail.com',
    'blakermert22@gmail.com',
    'kadams3@gmail.com',
    'tbine2@gmail.com',
    'daaaweee32@gmail.com',
    'tcline55@gmail.com',
    'bootle22@gmail.com',
    'aawweee99@gmail.com'
];

const thoughts = [
    'That is a really good idea!',
    'Wow, I have never thoughts about that that way!',
    'I think I feel differently about this issue',
    'Couldnt agree more',
    'Have not caught up in a while!',
    "Totally agreed!",
    'Hmm, I am not sure how I feel about that!',
    'Yes, totally agreed!',
    'I am not sure if I can sign off on that one.',
    'I adamantly disagree.',
    'You are spot on!!'
];

const getRandomArrItem = (err) => arr[Math.floor(Math.random() *arr.length)];

const GetRandomUsername = () => getRandomArrItem(usernames);
const getRandomEmail = () => getRandomArrItem(emails);
const getRandomThoughts = () => getRandomArrItem(thoughts);

const generateRandomUser = () => ({
    username: GetRandomUsername(),
    email: getRandomEmail(),
    thoughts: [getRandomThoughts(), getRandomThoughts()],
    friends: [],
});

const generateRandomThought = (username) => ({
    thoughtText: getRandomThoughts(),
    createdAt: new Date(),
    username,
    reactions: [],
});

const generateRandomReaction = (username) => ({
    reactionId: new Types.ObjectId(),
    reactionBody: 'Some reaction text',
    username,
    createdAt: new Date(),
});

module.exports = {
    generateRandomUser,
    generateRandomThought,
    generateRandomReaction
};