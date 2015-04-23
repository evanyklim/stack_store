'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var Cart = mongoose.model("Cart");
module.exports = router;

router.get('/CartItems', function (req, res) {
	console.log("REQUEST", req.body);
 
 	Cart.find({}, function(err, items){
 		console.log("items : ", items);
 		res.send(items);
 	});
});

router.delete('/CartItems', function (req, res){
	var user = req.body.user;
	var deletedItem = req.body.deletedItem;
	Cart.remove({items: deletedItem}, function(err, item){
		console.log("Deleted from cart: ", item);
	});
});

router.post('/CartItems', function(req, res){
	// var user = req.body.user;
	// var addedItem = req.body.addedItem;
	console.log(req.body);
	res.send('post request complete!');
	// Cart.create({items: addedItem}, function(err, item){
	// 	Cart.save();
	// });
});





//AJAX requests from Angular Factories on FrontEnd 

//UX
//1. User goes to home page
//2. Clicks register/sign up or proceeds as unauthenticated guest
//3. User goes to Carts page, reviews various products and adds them to the cart
//4. From the cart, user can add, modify, or delete items and then proceed to checkout
//5. During checkout, if user is logged in (checked using session-cookies), user is prompted for payment info
//6. If user is not logged in, user has option to proceed as guest or has option to register
//7. User makes payment and sees order status confirmed page



