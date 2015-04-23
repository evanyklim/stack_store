'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var Product = mongoose.model("Product");

router.get('/shoes', function (req, res) {
	console.log("REQUEST", req.body);
	
 

 	Product.find({category: {name: }}, function(err, shoes){
 		console.log("shoes : ", shoes)
 		res.send(shoes);
 	});

});