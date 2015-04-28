'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;
var Cart = mongoose.model("Cart");
var Order = mongoose.model("Order");

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_PeJIckQNGvtgdrK7jkJxLu5F");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form



router.post("/", function(req, res){
	var stripeToken = req.body.id;
	var authUser = req.user;
	var amountCharged = req.body.totalPrice;
	

	var charge = stripe.charges.create({
	  amount: amountCharged, // amount in cents, again
	  currency: "usd",
	  source: stripeToken,
	  description: "Example charge"
	}, function(err, charge) {
	  if (err && err.type === 'StripeCardError') {
	    // The card has been declined
	  }
	});


		Cart.findOne({user: authUser}, function(err, cart){
			Order.create({user: authUser, items: cart.items}, function(err, order){
				console.log("NEW ORDER CREATED : ", order);
			})

			cart.items = [];
			cart.save();
			res.json(cart);
		});

});
