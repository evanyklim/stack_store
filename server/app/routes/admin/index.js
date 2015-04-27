'use strict';
var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');
var Category = mongoose.model('Category');
module.exports = router;

// retrieve all categories for display
router.get('/categories/data', function (req, res) {
	Category.find({}, 'name', function (err, categories) {
		if (err) return err;
		res.send(categories);
	});
});

// add a category to the db
router.post('/categories/data', function (req, res) {
	Category.findOne(req.body).exec()
	.then(
	function (existingCategory) {
		if (existingCategory) { 
			res.send('That category already exists');
		} else {
			Category.create(req.body, function (err, newCategory) {
				if (err) return err;
				res.send('You\'ve created a new category!');
			});
		}
	});
});

// retrieve product data for display
router.get('/products/data', function (req, res) {
	//var options;
	Product.find({}, function (err, products) {
		if (err) return err;
		res.send(products);
	});
});

// add a new product document
router.post('/products/data', function (req, res) {
	Product.findOne({ name: req.body.name }).exec()
	.then(
	function (existingProduct) {
		if (existingProduct) {
			res.send('That product already exists');
		} else {
			Category.findOne({ name: req.body.category}).exec()
			.then(function (category) {
				req.body.category = category._id;
				Product.create(req.body, function (newProduct) {
					console.log(newProduct);
					res.send('You have created a new product!');
				});
			});
		}
	});
});

// retrieve user profiles
router.get('/users/data', function (req, res) {
	User.find({}, function (err, users) {
		if (err) return err;
		var userProfiles = users.map(function (user) {
			return _.omit(user.toJSON(), ['salt','password']);
		});
		res.send(userProfiles);
	});
});

// update user with administrative rights
router.post('/users/data', function (req, res) {
	console.log(req.body);
});