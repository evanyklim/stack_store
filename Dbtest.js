var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var promise = User.count({ email: 'obama@gmail.com', nickname: 'evan'}).exec();

promise.then(function (data) {
	console.log('count is:', data);  // returns 0 if nothing found
});

// var promise2 = Product.find().populate('reviews').exec();

// promise2.then(function (data) {
// 	console.log(data);
// });