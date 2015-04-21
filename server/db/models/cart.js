'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// require('./user.js');
// require('./product.js');

var cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orderDate: {type: Date, required: true, default: Date.now}
    //ordered: {type: boolean, default: false}
});

mongoose.model('Cart', cartSchema);