const { createLogger, format, transports } = require('winston');

const path = './logs/app';

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [
    new transports.File({ filename: `${path}.error.log`, level: 'error' }),
    new transports.File({ filename: `${path}.log` })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
