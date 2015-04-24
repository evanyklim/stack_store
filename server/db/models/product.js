'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

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
	category: { type: Schema.Types.ObjectId, ref: 'Category' },
	price: { type: Number },
	Reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

productSchema.plugin(deepPopulate);

mongoose.model('Product', productSchema);

//product --> cart.items 