var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/order');

var Order = mongoose.model('Order');

describe(' The Order model', function () {

	beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);	
	});

	afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

  	it('should do a bunch of things', function () {
    	// Order.create({items: ['a','b']}, function (err, createdOrder) {
    		// expect(createdOrder.items).toEqual(['a','b']);
    		expect(Order.items).to.be.a('array');
    		// done();
    	// });
  	});
});