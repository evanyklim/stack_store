'use strict';
var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
module.exports = router;

router.post('/userinfo', function (req, res) {

  var findUser = UserModel.findOne({ _id: req.body.data._id }).exec();

  findUser.then(function(user) {
		res.status(200).send({user: _.omit(user.toJSON(),['password','salt']) });
  });
});

