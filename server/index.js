const express = require('express');
const { port } = require('config');
const morgan = require('morgan');
const expressRoutesRegistrar = require('express-routes-registrar');
const { logger } = require('../shared');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(
    'combined',
    { stream: { write: (message) => logger.info(message.trim()) } }
  )
);

const setup = (controllers, routes) => {
  expressRoutesRegistrar(app)
    .register(routes, controllers);
};

const start = () => (
  Promise.resolve(app.listen(port, () => {
    logger.info('Express server started on port 3000');
  }))
);

const stop = () => app.close();

module.exports = { start, stop, setup };
