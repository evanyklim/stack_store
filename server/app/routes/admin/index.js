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
	Category.findOne(req.body).then(
		function (existingCategory) {
			if (existingCategory) { 
				res.send('That category already exists.');
			} else {
				Category.create(req.body, function (err, newCategory) {
					if (err) return err;
					res.send('You\'ve created a new category!');
				});
			}
		}
	);
});