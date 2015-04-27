// this file is for running simple tests on the db & practicing mongoose
var _ = require('lodash');
var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

var c = Category.create([{ name: 'Nike' },{ name: 'Adidas' },{ name: 'Saucony' }]);
var d = Category.find({})

c.then(function (err, stuff) {
	d.exec(function (err, docs) {
		console.log(docs);
	})
})
// var promise = User.count({ email: 'obama@gmail.com', nickname: 'evan'}).exec();
// promise.then(function (data) {
// 	console.log('count is:', data);  // returns 0 if nothing found
// });
// var ev = 'ev'
// var email = "obama@gmail.com"
// var query = User.$where('this.email === "'+email+'"');// || this.nickname === "'+ev + '"');
// var cb = function (err, results) {
// 	if (err) return err;
// 	console.log(results);
// 	console.log(_.omit(results[0].toJSON(),['_id','salt','password']));
// }
// query.exec(cb);