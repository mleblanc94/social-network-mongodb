const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema to create User model
const userSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
      },
      thoughts: [
      {
        type: String,
        required: true,
        max_length: 50,
      },
    ],
      friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
      ],
    },
    {
      toJSON: {
        getters: true,
      },
      id: false,
    }
  );

  // virtual to get a length on the users friends list
  userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });
  
  const User = model('User', userSchema);
  
  module.exports = User;