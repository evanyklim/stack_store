'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var Product = mongoose.model("Product");

router.get('/shoes', function (req, res) {


	Product.find({}).deepPopulate('Reviews.user').exec(function(err, products){
		res.json(products);		
		console.log(products);

	});
});

	// Product.find({}).
	// .populate('Reviews')
	// .exec()
	// .then(function (products) {
	// 	return products.map(function(product){
	// 		return product.Reviews.map(function(review){
	// 			return review
	// 			.populate('User').execPopulate().then(function(review){
	// 				console.log("HEREEEEEE", review);

	// 			});
	// 			});
	// 		});
	// 	});
	// });


	// .then(function (products) {
	// 	console.log(products);
	// });






router.post('/shoes', function(req, res){
		var newItem = req.body.items;
		Product.create({name: newItem}, function(err, product){ //replace when products page has products listed
			res.send(product);
	});
});

