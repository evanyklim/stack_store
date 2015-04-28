'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var Cart = mongoose.model('Cart');
module.exports = router;

router.post('/newuser', function(req, res){
	var nickname = req.body.nickname,
		email = req.body.email;
	var search = User.findOne({ email: email, nickname: nickname }).exec();

	search.then(function (existingDoc) {
		if (existingDoc) { 
			res.send('Those credentials are already taken, please try again');
		} else {
			User.create(req.body).then(function (newUser) {
				Cart.create({ user: newUser._id }).then(function (newCart) {
					res.send('You\'ve successfully created an account (a cart has been assigned to you)!');
				});
			});
		}
	});
	// .catch(function (err) {   // does this even work?
	// 	console.log(err);
	// });
});