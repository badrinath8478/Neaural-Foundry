const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    __id: mongoose.Schema.Types.ObjectId,
    Title: {
        type: String,
        required: true
    },
    Year: {
        type: Number,
        required: true
    },
    Rating: {
        type: Number,
        required: true
    },
    ShortMessage: {
        type: String,
        required: true
    },
    Review: {
        type: String,
        required: true
    },
    Poster: { type: String, required: true },
    PostedBy: { type: String, required: true },
    UpdatedAt: { type: Date, default: Date.now },
    CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movie", movieSchema);
