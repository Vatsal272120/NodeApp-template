const express = require('express');
const pino = require('express-pino-logger')();
const audit = require('express-requests-logger');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { log } = require('./logger');

dotenv.config();

// initialise app
const app = express();

app.use(express.json());
app.use(cors());

// logger
app.use(
  audit({
    logger: log, // Existing bunyan logger
    excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
    request: {
      maskBody: ['password'], // Mask 'password' field in incoming requests
      excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
      excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
      maskHeaders: ['*'], // Mask 'header1' header in incoming requests
      maxBodyLength: 50, // limit length to 50 chars + '...'
    },
    response: {
      maskBody: ['session_token'], // Mask 'session_token' field in response body
      // excludeHeaders: ['*'], // Exclude all headers from responses,
      // excludeBody: ['*'], // Exclude all body from responses
      maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
      maxBodyLength: 50, // limit length to 50 chars + '...'
    },
  })
);

// db config and connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      log.info(`Server listening at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => log.error(err));
