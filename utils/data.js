// User data
const userData = [
    {
      username: 'user1',
      email: 'user1@example.com',
      thoughts: [],
      friends: [],
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      thoughts: [],
      friends: [],
    },
  ];
  
  // Thought data
  const thoughtData = [
    {
      thoughtText: 'This is a sample thought by user1.',
      username: 'user1',
      reactions: [],
    },
    {
      thoughtText: 'Another sample thought by user2.',
      username: 'user2',
      reactions: [],
    },
  ];

  // Reaction data
  const reactionData = [
    {
      reactionBody: 'This is a reaction to the first thought!',
      username: 'user2',
    },
    {
      reactionBody: 'Interesting thought!',
      username: 'user1',
    },
  ];
  
  module.exports = { userData, thoughtData, reactionData };