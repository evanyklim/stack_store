'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    // change to items: [Product] or the like
    orderDate: { type: Date, required: true, default: Date.now },
    orderStatus: String
});

// var order;
// order.totalPrice(function (err, totalPrice) {
// 	// do stuff with totalPrice
// });

// console.log(order.blah.then());


orderSchema.methods.totalPrice = function totalPrice (cb) {
	this.populate("cart").exec(function(err, order){
			if(err) return cb(err);
		order.cart.populate('items').exec(function(err, cart){
			if(err) return cb(err);
			var totalPrice;
			for(var i = 0; i < cart.items.length; i++){
				totalPrice += cart.items[i].price;
			}

			cb(null, totalPrice);
		});
	});
};

// orderSchema.virtual('totalPrice')
// .get(function () {
// 	return this.populate('cart').exec().then(function(order){
// 		return order.cart.populate('items').exec()
// 	}).then(function(cart){
// 		var totalPrice;
// 		for(var i = 0; i < cart.items.length; i++){
// 			totalPrice += cart.items[i].price;
// 		}

// 		return totalPrice;
// 	})
// });

mongoose.model('Order', orderSchema);