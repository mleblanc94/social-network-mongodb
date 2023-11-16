const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Controllers for the user routes
  module.exports = {
    // Get all users
    async getAllUsers(req, res) {
      try {
        const users = await User.find().populate('thoughts friends', '-__v');
        const userObj = users.map(user => ({
            thoughts: user.thoughts.map(thought => thought.id),
            friends: user.friends.map(friend => friend._id),
            _id: user._id,
            username: user.username,
            email: user.email,
            friendCount: user.friendCount
        }));
  
        res.json(userObj);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single user
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .populate({
            path: 'thoughts',
            populate: {
                path: 'reactions',
                select: 'reactionId createdAt _id reactionBody username',
            },
            select: '_id thoughtText username createdAt reactions reactionCount',
          })
          .populate({
            path: 'friends',
            select: '_id username email friendCount',
            populate: {
                path: 'thoughts',
                select: '_id',
            },
          })
          .select('_id username email friendCount');

        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' })
        }
  
        res.json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Create a new user
    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Update a user by its id
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
              new: true,
              runValidators: true,
            });

            if (!user) {
              return res.status(404).json('No user exists with that ID');
            }

            res.json(user);
        } catch (err) {
          console.error(err);
          res.status(500).json(err)
        }
    },

    // Delete a user
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });
  
        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }
  
        res.json({ message: 'Student successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
  };
  