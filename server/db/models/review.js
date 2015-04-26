'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	 user: { type: Schema.Types.ObjectId, ref: 'User' },
	 title: String,
	 date: { type: Date, default: Date.now },
	 body: String,
	 score: Number
});

mongoose.model('Review', reviewSchema);
