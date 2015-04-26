'use strict';
var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
module.exports = router;

router.get('/userinfo', function (req, res) {

  var findUser = UserModel.findOne({ _id: req.user._id }).exec();
  findUser.then(function(user) {
  	// consider lodash: _.omit(user.toJSON(),['password','salt'])
	res.status(200).send(user);
  });
});

