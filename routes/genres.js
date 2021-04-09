const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre } = require("../models/genre");
const router = express.Router();

router.get("/", async (req, res) => {
    
    try {
        let genres = await Genre.find().select('-__v');
        
        if (!genres || genres.length != 2) {
            await Genre.remove();

            let genre = new Genre({ name: '支出' });
            await genre.save();
            genre = new Genre({ name: '收入' });
            await genre.save();

            genres = await Genre.find().select('-__v');
        }

        res.send(genres);
        
    } catch (ex) {
        
    }


});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('该类型不存在！');

    res.send(genre);
})

module.exports = router;
