'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});


cartSchema.methods.totalPrice = function totalPrice (cb) {
	
	this.populate('items',function(err, cart){
		if(err) return cb(err);
		var totalPrice = 0;
		for(var i = 0; i < cart.items.length; i++){
			totalPrice += parseInt(cart.items[i].price);
		}


		cb(null, totalPrice);
	});
};

mongoose.model('Cart', cartSchema);