const chai = require('chai');
const express = require('express');
const chaiHttp = require('chai-http');
const { OK } = require('http-status-codes');
const expressRoutesRegistrar = require('express-routes-registrar');
const { productsRoutes } = require('../routes');
const { productsController } = require('../controllers');

const { expect } = chai;

chai.use(chaiHttp);

describe('Request products', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  const requester = chai.request(app).keepOpen();

  before((done) => {
    registrar.registerRoutesJson(
      productsRoutes,
      productsController
    );
    done();
  });

  after((done) => {
    requester.close();
    done();
  });

  describe('Return products', () => {
    it('Sort Products', () => (
      requester
        .get('/products/cellphone/sort')
        .then(({ statusCode, body }) => {
          expect(body).to.an('array');
          expect(statusCode).to.equal(OK);
        })
    ));
    it('get all products', () => (
      requester
        .get('/products/cellphone')
        .then(({ statusCode, body }) => {
          expect(body).to.an('array');
          expect(statusCode).to.equal(OK);
        })
    ));
  });
});
