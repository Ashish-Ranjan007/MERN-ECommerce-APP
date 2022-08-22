// Third party modules
const express = require('express');
const cookieParser = require('cookie-parser');

// Local modules
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const product = require('./routes/productRoute');
const errorMiddleware = require('./middlewares/error');

// Initialize express app
const app = express();

// setup express to parse requests with json
app.use(express.json());

// setup express to parse cookies
app.use(cookieParser());

// Routes
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', product);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
