const { User, Thought } = require('../models');

module.exports = {
// Controllers for thought routes

// Get all thoughts
async getAllThoughts(req, res) {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
},

// Get a single thought by its ID
async getSingleThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
},

// Create a new thought
async createThought(req, res) {
    try {
        const { thoughtText, username, userId } = req.body;
        const thought = await Thought.create({ thoughtText, username });

        // Push the created thought's ID to the associated user's thoughts array field
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        res.json(thought);
    } catch(err) {
        console.error(err);
        res.status(500).json(err)
    }
},

// Update a thought by its ID
async updateThought(req, res) {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' })
        }

        res.json(updatedThought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
},

// Delete a thought by its ID
async deleteThought(req, res) {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);

        if (!deletedThought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        // Remove the thought from the users array of thoughts
        await User.updateOne(
            { _id: deletedThought.userId },
            { $pull: { thoughts: deletedThought._id } }
        );

        res.json({ message: 'Thought was deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
},

// Create a reaction for a thought
async createReaction(req, res) {
    try {
        const { reactionBody, username } = req.body;
        const newReaction = {
            reactionBody,
            username,
            createdAt: new Date(),
            reactionId: Types.ObjectId(),
        };

        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: newReaction } },
            { new: true }
        );

        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        res.json(updatedThought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
},

// Remove a reaction by referencing the generated reaction ID
async removeReaction(req, res) {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;

        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $pull: { reactions: { reactionId } } },
            { new: true }
        );

        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        res.json(updatedThought);
    } catch (err) {
    console.error(err);
    res.status(500).json(err);
} 
},
}
