'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/tutorial', require('./tutorial'));
router.use('/members', require('./members'));
router.use('/products', require('./products'));
router.use('/account', require('./account'));
router.use('/cart', require('./cart'));
router.use('/create', require('./create'));
router.use('/admin', require('./admin'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});