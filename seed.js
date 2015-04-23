/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

Refer to the q documentation for why and how q.invoke is used.

*/

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var q = require('q');
var chalk = require('chalk');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Cart = mongoose.model('Cart');
var Order = mongoose.model('Order');

var productsDB = require('./productsDb.js');

var getCurrentUserData = function () {
  return q.ninvoke(User, 'find', {});
};

var getCurrentProduct = function () {
  return q.ninvoke(Product, 'find', {});
};

var getCurrentCart = function() {
  return q.ninvoke(Cart, 'find', {});
};

var seedUsers = function () {
  var users = [
    { email: 'testing@fsa.com', password: 'password' },
    { email: 'obama@gmail.com', password: 'potus' }
  ];
  return q.invoke(User, 'create', users);
};

var seedProducts = function () {
  var products = productsDB;
  return q.invoke(Product, 'create', products);
};

var seedCart = function () {
  var cart = {
    user: new User({
      email: 'Anirban',
      password: 'Evan'
    }),
    items: [ new Product({
      name: "Nike SB",
      image: "someURL"
    })]
  };
  return q.invoke(Cart, 'create', cart);
};

connectToDb.then(function () {
  getCurrentUserData().then(function (users) {
    if (users.length === 0) {
      return seedUsers();
    } else {
      console.log(chalk.magenta('Seems to already be user data, exiting!'));
      process.kill(0);
    }
  }).then(function () {
    console.log(chalk.green('Seed successful!'));
    process.kill(0);
  }).catch(function (err) {
    console.error(err);
    process.kill(1);
  });

  getCurrentProduct().then(function (products) {
    return seedProducts();
  });

  getCurrentCart().then(function (carts) {
    return seedCart();
  })

});