const express = require('express');
const passport = require('passport');
const router = express.Router();

const failController = require('../controllers/fail');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');
const isAdmin = require('../middleware/isAdmin');


// create new order after failed order
router.post('/create-new-after-fail', passport.authenticate('jwt', { session: false }), failController.createNewAfterFail);

// get failed orders
router.post('/get-failed-orders', passport.authenticate('jwt', { session: false }), failController.getFailedOrders);

module.exports = router;