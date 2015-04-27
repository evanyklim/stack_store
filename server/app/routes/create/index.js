'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = router;

router.post('/newuser', function(req, res){
	var nickname = req.body.nickname,
		email = req.body.email;
	var search = User.findOne({ email: email, nickname: nickname }).exec();
	//var createNew = User.create(req.body); // ask gabe about this

	search.then(function (existingDoc) {
		// not unique
		console.log('existingDoc is: ', existingDoc);
		if (existingDoc) { 
			res.send('Those credentials are already taken, please try again');
		} else {
			User.create(req.body).then(function (newUser) {
				res.send('You\'ve successfully created an account!');
			});
		}
	});
	// .catch(function (err) {   // does this even work?
	// 	console.log(err);
	// });
});