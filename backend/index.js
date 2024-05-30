const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const categoryRoute =require('./routes/category');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Corrected
app.use('/user', userRoute); // Corrected
app.use('/category',categoryRoute);
module.exports = app;
