// Third party modules
const express = require('express');

// Local modules
const product = require('./routes/productRoute');

// Initialize express app
const app = express();

// setup express to parse requests with json
app.use(express.json());

// Routes
app.use('/api/v1', product);

module.exports = app;
