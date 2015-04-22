'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var productSchema = new Schema({
	name: String,
	availability: Boolean, //in or out of stock
	image: String,
	description: String,
	category: String, //for organizational purposes
	price: { type: Number, min: 4 },
	Reviews: [{ title: { type: String, max: 100}, date: { type: Date, default: Date.now }, 
			    body: { type: String, max: 300 }, score: { type: Number, min: 1, max: 5} }]
});

module.exports = mongoose.model('Product', productSchema);