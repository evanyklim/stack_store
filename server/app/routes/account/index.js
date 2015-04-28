'use strict';
var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;

router.get('/', function (req, res) {
  
  var findUser = User.findOne({ _id: req.user._id }).exec();
  
  findUser.then(function (user) {
		res.status(200).send(_.omit(user.toJSON(),['_id','salt','password']));
  });
});

router.post('/', function (req, res) {
 
  var id = req.user._id;
  var update = req.body;
	// tried to create validation for unique email / nickname but it seems too complex

	var updateUser = User.findByIdAndUpdate(id, _.omit(update, ['orders']));

	updateUser.exec(function (err, user) {
		res.send('You have successfully updated your account!');
	});
});

