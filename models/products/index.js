/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const request = require('request-promise');

class Products {
  constructor() {
    this._products = {};
  }

  getAllProducts() {
    return this.getProducts()
      .then((products) => this.getAllSellers(products))
      .then((sellers) => this.buildResultSeller(sellers))
      .then((parseSellers) => this.buildResultGetAll(parseSellers));
  }

  getSortProducts() {
    return this.get1000Products()
      .then((products) => this.getAllSellers(products))
      .then((sellers) => this.buildResultSeller(sellers))
      .then((parseSellers) => this.buildResultGetSort(parseSellers));
  }

  get1000Products() {
    const result = [];
    for (let i = 0; i < 20; i += 1) {
      result.push(this.getSortProductPag(i));
    }
    return Promise.all(result).then((d) => d.reduce((a, b) => a.concat(b), []));
  }

  getSortProductPag(pag) {
    return request(`
      https://api.mercadolibre.com/sites/MLM/search?category=MLM1051&offset=${pag}&sort=price_asc&limit=2
    `)
      .then(this.parseInfo);
  }

  getProducts() {
    return request(`
    https://api.mercadolibre.com/sites/MLM/search?category=MLM1051
    `)
      .then(this.parseInfo);
  }

  getAllSellers(parseProducts) {
    this._products.raw = parseProducts;
    const getSellersInfo = () => parseProducts
      .map((product) => this.getSellerByProduct(product.seller.id));
    return Promise.all(getSellersInfo());
  }

  buildResultSeller(sellers) {
    return sellers.map(({ nickname, id }) => ({ id, nickname }));
  }

  buildResultGetAll(sellers) {
    const products = this._products.raw;
    const result = [];
    for (let i = 0; i < products.length; i += 1) {
      result.push(this.buildProductInfo(products[i], sellers));
    }
    return result;
  }

  buildProductInfo(product, sellers) {
    const sellerName = sellers.find(
      (seller) => seller.id === product.seller.id
    ).nickname;
    return {
      site_id: product.site_id,
      title: product.title,
      sellerId: product.seller.id,
      price: product.price,
      quantity: product.available_quantity,
      link: product.permalink,
      address: `${product.address.city_name} ${product.address.state_name}`,
      free_shipping: product.shipping.free_shipping,
      logistic_type: product.shipping.logistic_type,
      attributes: product.attributes.map(({ id, value_name }) => (
        { id, value_name }
      )),
      seller_name: sellerName
    };
  }

  buildResultGetSort(sellers) {
    const products = this._products.raw;
    const result = [];
    for (let i = 0; i < products.length; i += 1) {
      result.push(this.buildProductInfoSort(products[i], sellers));
    }
    return result;
  }

  buildProductInfoSort(product, sellers) {
    const sellerName = sellers.find(
      (seller) => seller.id === product.seller.id
    ).nickname;
    return {
      sellerId: product.seller.id,
      seller_name: sellerName,
      free_shipping: product.shipping.free_shipping,
      logistic_type: product.shipping.logistic_type,
      address: `${product.address.city_name} ${product.address.state_name}`,
      condition: product.condition,
      price: product.price,
      brand: product.attributes.filter((p) => p.id === 'BRAND')[0].value_name
    };
  }

  getSellerByProduct(id) {
    return request(`
    https://api.mercadolibre.com/users/${id}
    `).then((seller) => JSON.parse(seller));
  }

  parseInfo(info) {
    return JSON.parse(info).results;
  }
}

module.exports = Products;
