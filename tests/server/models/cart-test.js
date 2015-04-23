var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/cart'); 
require('../../../server/db/models/user'); 


var Cart = mongoose.model('Cart');
var User = mongoose.model('User');

describe('Cart model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Cart).to.be.a('function');
    });

    xit('should have email and password for the user property in the cart module', function (done) {
    var testUser = new User({ email: "ob@gmail.com", password: "hello_world" })
    console.log("user", testUser);
    var cart = new Cart({ user: new User({ email: "ob@gmail.com", password: "hello_world" }) });
    console.log("cart", cart);
        cart.save(function(err) {
        expect(cart.user.email).to.be.equal("ob@gmail.com");
        expect(cart.user.password).to.be.equal("hello_world");

        done(err);
        });
    });


    describe('on creation', function () {

        var createCart = function () {
            return Cart.create({ user: new User({ email: "ob@gmail.com", password: "hello_world"})});
        };


    });

});

