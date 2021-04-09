const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const { userSchema } = require("./user");

const billSchema = new mongoose.Schema({
    user: {
        type: userSchema,
        required: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
});

const Bill = mongoose.model("Bills", billSchema);

function validateBill(bill) {
    const schema = {
        title: Joi.string().max(50).required(),
        userId: Joi.objectId().required(),
        // time: Joi.date().required(),
        remarks: Joi.string().max(50),
        price: Joi.number().min(0).required(),
        genreId: Joi.objectId().required(),
    };

    return Joi.validate(bill, schema);
}

exports.Bill = Bill;
exports.validate = validateBill;
