const bills = require('./routes/bills');
const users = require('./routes/users');
const genres = require('./routes/genres');
const auth = require('./routes/auth');
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Joi = require('joi');
const cors = require('cors');

app.use(cors());

Joi.objectId = require('joi-objectid')(Joi);

app.use(express.json());
app.use('/api/bills', bills);
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);

const db = "mongodb://localhost/app_test";
mongoose
  .connect(db)
  .then(() => console.log(`Connected to ${db}`))
  .catch(err => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
