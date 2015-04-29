'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var Product = mongoose.model("Product");
var User = mongoose.model("User");
var Review = mongoose.model("Review");

router.get('/shoes', function (req, res) {


	Product.find({}).deepPopulate('reviews.user').exec(function(err, products){
		res.json(products);		
		console.log(products);

	});
});

router.post('/shoes', function(req, res){
		var newItem = req.body.items;
		Product.create({name: newItem}, function(err, product){ //replace when products page has products listed
			res.send(product);
	});
});

router.post('/shoes/reviews', function (req, res){

	console.log(req.user);

	var shoeName = req.body.name;
	var addedReview = req.body.reviews[req.body.reviews.length-1];



	Product.findOne({ name: shoeName })
		.populate('reviews').exec(function (err, product){
		
			Review.create({ title: addedReview.title, score: addedReview.score, body: addedReview.body })
				.populate('user').exec(function (err, review){
					console.log("REVERQERQERW", review);
					if(req.user._id) {
						User.findById(req.user._id);
					} 
					//could add guest user account to redirect reviews without a logged-in user
			})

	});

	Product.findOne({ name: shoeName }, function (err, product) {

		
		Review.create({ title: addedReview.title, score: addedReview.score, body: addedReview.body }, function(err, review){

			product.reviews.push(review);
			product.save();

		});
		//product.Reviews.push(addedReview);
		//product.save();
		res.json(product);
	});

});
