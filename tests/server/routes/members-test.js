var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/app/routes/members');

/**
 *
 * Members Route Tests
 *
 *
 */
describe('Members Route', function () {

  /**
   * First we clear the database before beginning each run
   */
    beforeEach('Clear test database', function (done) {
        clearDB(done);
    });


  describe('GET /members', function () {

  });



});
