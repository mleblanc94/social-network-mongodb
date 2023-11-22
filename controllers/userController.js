const { User } = require('../models');

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
  