const pino = require('pino');

const log = pino({
  prettyPrint: {
    levelFirst: true,
  },

  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

module.exports.log = log;
