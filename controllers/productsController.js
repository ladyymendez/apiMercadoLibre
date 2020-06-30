/* eslint-disable class-methods-use-this */
const { Product } = require('../models');
const { logger } = require('../shared');

class ProductsController {
  getByCategory(req, res) {
    return Product.getAllProducts()
      .then((products) => res.status(200).json(products))
      .catch((err) => {
        logger.error(`Error on the server, ${err}`);
        res.status(500).send(err);
      });
  }

  getSort(req, res) {
    return Product.getSortProducts()
      .then((products) => res.status(200).json(products))
      .catch((err) => {
        logger.error(`Error on the server, ${err}`);
        res.status(500).send(err);
      });
  }
}

module.exports = ProductsController;
