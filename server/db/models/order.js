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

orderSchema.methods.totalPrice = function totalPrice (cb) {
	// return this.model('Cart').find({}, cb);
};

mongoose.model('Order', orderSchema);