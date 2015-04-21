var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    user: [UserSchema],
    items: [productSchema],
    orderDate: {type: Date, required: true, default: Date.now},
    ordered: {type: boolean, default: false}
});


mongoose.model('Cart', cartschema);