const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { Bill } = require("../models/bill");

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.get("/", [auth, admin], async (req, res) => {
    const users = await User.find().select("name").sort("name");

    res.send(users);
});

router.post("/", async (req, res) => {
    if (
        !req.body.invitationCode ||
        (req.body.invitationCode != 1234 && req.body.invitationCode != 5678)
    )
        return res.status(400).send("邀请码错误！");

    const isAdmin = req.body.invitationCode == 5678;
    delete req.body.invitationCode;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ name: req.body.name });
    if (user) return res.status(400).send("该用户已注册！");

    user = new User(_.pick(req.body, ["name", "password"]));
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    if (isAdmin) user.isAdmin = true;
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["_id", "name"]));
});

router.delete("/:id", [auth, validateObjectId, admin], async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("未找到该用户！");
    if (user.isAdmin) return res.status(400).send("权限不够！");

    await User.findByIdAndRemove(req.params.id).select('-__v');

    let bill;

    do {
        bill = await Bill.findOneAndRemove({ user });
    } while (bill);

    res.send(user);
});

module.exports = router;
