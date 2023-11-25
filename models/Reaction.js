const { Schema, model, Types } = require('mongoose');

// Reaction Schema
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { getters: true },
});

// Creating the Reaction Model
const Reaction = model('Reaction', reactionSchema);

module.exports = Reaction;