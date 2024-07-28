const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require ('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/api_error');
const globalError = require('./middlewares/error_middleware');
const dbConnection = require('./config/database');

const mountRouts = require('./api');

dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json({Limit: '20kb'}));

// Routes
mountRouts(app);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: 'too many requests from this IP'
})

app.use(hpp()); //protect against HTTP Parameter Pollution attacks

app.use(mongoSanitize());

// Apply the rate limiting middleware to all requests.
app.use('/api',limiter)

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});