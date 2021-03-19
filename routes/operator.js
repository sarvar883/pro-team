const express = require('express');
const passport = require('passport');
const router = express.Router();

const operatorController = require('../controllers/operator');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getSortedOrders);

router.post('/get-not-comp-orders', passport.authenticate('jwt', { session: false }), operatorController.getNotCompOrders);

router.post('/get-complete-orders', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getCompleteOrders);

router.post('/get-complete-order-by-id/:id', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getCompleteOrderById);

router.post('/confirm-complete-order', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.confirmCompleteOrder);

router.post('/get-repeat-orders', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getRepeatOrders);

router.post('/repeat-order-form', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.repeatOrderForm);

router.post('/repeat-order-not-needed', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.repeatOrderNotNeeded);

router.post('/get-operator-stats', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getOperatorStats);

module.exports = router;