const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(400).send("用户名或密码错误！");

    const validPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("用户名或密码错误！");

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(req, schema);
}

module.exports = router;
