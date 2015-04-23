var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/app/routes/products');

/**
 *
 * Products Route Tests
 *
 *
 */
describe('Products Route', function () {

  /**
   * First we clear the database before beginning each run
   */
    beforeEach('Clear test database', function (done) {
        clearDB(done);
    });


  describe('GET /products', function () {

  });



});
