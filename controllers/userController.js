const { User } = require('../models');

// Controllers for the user routes
  module.exports = {

    async getAllUsers(req, res) {
      try {
        const users = await User.find()
          .populate({
            path: 'thoughts',
            select: '_id thoughtText username createdAt reactions reactionCount',
          })
          .populate('friends', '_id username email friendCount')
          .select('_id username email');
  
        const formattedUsers = users.map(user => ({
          thoughts: user.thoughts.map(thought => ({
            _id: thought._id,
          })),
          friends: user.friends.map(friend => ({
            _id: friend._id,
          })),
          _id: user._id,
          username: user.username,
          email: user.email,
          friendCount: user.friendCount,
        }));
  
        res.json(formattedUsers);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get single user
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .populate({
            path: 'thoughts',
            select: '_id thoughtText username createdAt reactions __v reactionCount',
          })
          .populate('friends', '_id username email friendCount')
          .select('_id username email friendCount __v')

          const formattedUser = {
            thoughts: user.thoughts.map(thought => ({
              _id: thought._id,
              thoughtText: thought.thoughtText,
              username: thought.username,
              reactions: thought.reactions.map(reaction => ({
                reactionId: reaction.reactionId,
                createdAt: reaction.createdAt,
                _id: reaction._id,
                reactionBody: reaction.reactionBody,
                username: reaction.username,
              })),
              __v: thought.__v,
              reactionCount: thought.reactionCount,
            })),
            friends: user.friends.map(friend => ({
              thoughts: friend.thoughts.map(thought => ({
                _id: thought._id,
              })),
              friends: friend.friends.map(friendly => ({
                _id: friendly._id,
              })),
              _id: friend._id,
              username: friend.username,
              email: friend.email,
              __v: friend.__v,
              friendCount: friend.friendCount,
            })),
            _id: user._id,
            username: user.username,
            email: user.email,
            friendCount: user.friendCount
          };

        res.json(formattedUser);
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
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
        const user = await User.findOneAndDelete({ _id: req.params.userId });
  
        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }
  
        res.json({ message: 'Student successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // Adding a friend to a user's friend list
    async addFriend(req, res) {
      try {
        const user = await User.findById(req.params.userId);
        const friendId = req.params.friendId;

        if (!user) {
          return res.status(400).json({ message: 'no user found with that ID' })
        }

        // Check to see if the user is already friends with the requested friend to add
        if (user.friends.includes(friendId)) {
          return res.json(400).json({ message: 'User is already friends with this person' })
        }

        // Add friend to friends list
        user.friends.push(friendId);
        await user.save();

        res.json({ message: 'Friend has been added successfully' })
        } catch (err) {
          console.error(err);
          res.status(500).json(err);
      }
    },

    // Removing a friend from friend list
    async deleteFriend(req, res) {
      try {
        const { userId, friendId } = req.params;
        const user = await User.findByIdAndUpdate(
          userId, 
          { $pull: { friends: friendId } },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found'});
        }

        res.json(user);
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    }
  };
  