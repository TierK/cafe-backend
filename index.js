const express = require('express');
let cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/users');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);

module.exports = app;