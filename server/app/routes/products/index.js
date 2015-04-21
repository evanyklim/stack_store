'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

router.get('/shoes', function (req, res) {

    var resShoes = ['here are some nice shoes', 'Nike', 'Adidas'];

    res.send(resShoes);
});