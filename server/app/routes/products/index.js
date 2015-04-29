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
	});
});

router.post('/shoes', function(req, res){
		var newItem = req.body.items;
		Product.create({name: newItem}, function(err, product){ //replace when products page has products listed
			res.send(product);
	});
});

router.post('/shoes/reviews', function (req, res){

	var shoeName = req.body.name;
	var addedReview = req.body.reviews[req.body.reviews.length-1];
	var user = req.user;


	Product.findOne({ name: shoeName }, function (err, product) {

		
		Review.create({ title: addedReview.title, score: addedReview.score, body: addedReview.body }, function (err, review){
			if(req.user) { review.user = user }
			review.save(function (err, savedReview){
				product.reviews.push(review)
				product.save(function (err, savedProduct) {
					Product.findById(savedProduct._id).deepPopulate('reviews.user').exec(function(err, product){
						res.json(product);		
					});
				});
			})
		});
	});
});