'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: String
});

mongoose.model('Category', categorySchema);
