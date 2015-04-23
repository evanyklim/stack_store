// dummy data for seed file - incomplete

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var Cart = mongoose.model('Cart');
var Product = mongoose.model('Product');

var users = require('./Dbusers.js');
// var products = require('./Dbproducts.js');
// console.log(products)

Cart.create({
	user: users.Anirban._id,
	items: [ new Product({ name: 'Shoe1' }) ]
}).then(function (mycart) {
	console.log('this is the cart created:', mycart);
});

// module.exports = {
// 	seedCart: seedCart
// };


