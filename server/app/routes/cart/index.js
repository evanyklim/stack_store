'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var Cart = mongoose.model("Cart");
var Product = mongoose.model("Product");
module.exports = router;

router.get('/', function (req, res) {
	var authUser = req.user;
 	Cart.findOne({user: authUser}).populate('items').exec(function (err, cart) {
 		cart.totalPrice(function(err, cartPrice){
 			var cartObject = cart.toObject();
 			cartObject.price = cartPrice;
 			console.log("Cart Price: ", cartPrice);
 			console.log("CART OBJECT: ", cartObject)
 			res.json(cartObject);
 		});
 	});
});

router.delete('/items', function (req, res){
	var authUser = req.user;
	var product = req.body.product;
	//need to get productID from front-end and use to remove from items array 
	Cart.findOne({user: authUser}, function(err, cart){
		cart.items.filter(function(x){return x !== product});
		cart.save();
	});
});

router.post('/items', function(req, res){
	var authUser = req.user;
	var addedProduct = req.body;
	Cart.findOne({user: authUser}, function(err, cart){
		cart.items.push(addedProduct._id);
		cart.save();
		console.log(cart);
		res.json(cart);
	});
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



