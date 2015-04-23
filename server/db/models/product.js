'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;


var categorySchema = new Schema({
	name: String
});


var reviewSchema = new Schema({
	 user: { type: Schema.Types.ObjectId, ref: 'User' },
	 title: String,
	 date: { type: Date, default: Date.now },
	 body: String,
	 score: Number
});


var productSchema = new Schema({
	name: String,
	image: String,
	description: String,
	category: [categorySchema],
	price: { type: Number },
	reviews: [reviewSchema]
});

module.exports = mongoose.model('Product', productSchema);

//product --> cart.items 