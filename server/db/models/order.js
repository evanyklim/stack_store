'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orderDate: { type: Date, required: true, default: Date.now }
});

mongoose.model('Order', orderSchema);