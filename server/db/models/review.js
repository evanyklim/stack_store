'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	 user: { type: Schema.Types.ObjectId, ref: 'User' },
	 title: String,
	 date: { type: Date, default: Date.now },
	 body: String,
	 product: { type: Schema.Types.ObjectId, ref: 'Product' },
	 score: Number
});

mongoose.model('Review', reviewSchema);
