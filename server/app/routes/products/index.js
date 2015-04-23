'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var Product = mongoose.model("Product");

router.get('/shoes', function (req, res) {

	Product.find({}, function(err, products){
		console.log(products);		
		res.send(products);
	});

});