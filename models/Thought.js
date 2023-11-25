const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            max_length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction'}],
    },
    {
        toJSON: { getters: true },
    }
);

// Virtual to get reaction count

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Creating the Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;