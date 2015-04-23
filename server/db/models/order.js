'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    orderDate: { type: Date, required: true, default: Date.now }
});


//NEED METHOD TO CALCULATE TOTAL PRICE USING CART SCHEMA
mongoose.model('Order', orderSchema);