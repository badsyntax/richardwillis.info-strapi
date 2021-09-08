const { LOG_LEVEL = 'error' } = process.env;

module.exports = {
  settings: {
    logger: {
      level: LOG_LEVEL,
    },
  },
};
