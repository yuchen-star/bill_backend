const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10
    }
});

const Genre = mongoose.model('Genre', genreSchema);

exports.Genre = Genre;
exports.genreSchema = genreSchema;
