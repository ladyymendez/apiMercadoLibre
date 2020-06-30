const server = require('./server');
const routes = require('./routes');
const controller = require('./controllers');
const { logger } = require('./shared');

server.start()
  .then(() => server.setup(controller, routes))
  .catch((error) => logger.error(error));
