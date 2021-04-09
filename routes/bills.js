const express = require("express");
const router = express.Router();
const { Bill, validate } = require("../models/bill");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Genre } = require("../models/genre");
const _ = require("lodash");
const admin = require("../middleware/admin");
const config = require("config");
const jwt = require("jsonwebtoken");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", [auth, admin], async (req, res) => {
    const bills = await Bill.find().select(["-__v", "-user.password"]).sort("time");

    res.send(bills);
});

router.post("/", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("无效用户！");

    // const userByToken = jwt.verify(req.header('x-auth-token'), config.get('jwtPrivateKey'));
    // if (user != userByToken) return res.status(400).send('该用户账号异常！');

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("无效类型！");

    const bill = new Bill({
        user: {
            _id: user._id,
            name: user.name,
            password: user.password,
        },
        title: req.body.title,
        remarks: req.body.remarks,
        price: req.body.price,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        time: Date.now(),
    });

    await bill.save();

    res.send(bill);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("无效用户！");

    const userByToken = jwt.verify(req.header("x-auth-token"), config.get("jwtPrivateKey"));
    if (user == userByToken) return res.status(400).send("该用户账号异常！");

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("无效类型！");

    const bill = await Bill.findByIdAndUpdate(
        req.params.id,
        {
            user: {
                _id: user._id,
                name: user.name,
                password: user.password,
            },
            title: req.body.title,
            remarks: req.body.remarks,
            price: req.body.price,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            time: Date.now(),
        },
        { new: true }
    );

    if (!bill) return res.status(404).send("该账单不存在！");

    res.send(_.pick(bill, ["_id", "user._id", "user.name", "title", "price", "genre", "time"]));
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const bill = await Bill.findByIdAndRemove(req.params.id);

    if (!bill) return res.status(404).send("该账单不存在！");

    res.send(bill);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
    const bill = await Bill.findById(req.params.id).select(["-__v", "-user.password"]);
    if (bill) {
        return res.send(bill);
    }

    const user = await User.findById(req.params.id);
    if (user) {
        let bills = await Bill.find().select(["-__v", "-user.password"]).sort("time");

        bills = bills.filter(b => b.user._id == req.params.id);

        return res.send(bills);
    }

    return res.status(404).send("未找到数据！");
});

module.exports = router;
