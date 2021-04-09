const Joi = require('joi');
const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
});

const Label = mongoose.model('Label', labelSchema);

function validateLabel(label) {
    const schema = {
        name: Joi.string().min(2).max(20).required()
    };

    return Joi.validate(label, schema);
}

exports.labelSchema = labelSchema;
exports.Label = Label;
exports.validate = validateLabel;