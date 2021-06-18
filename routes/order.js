const express = require('express');
const passport = require('passport');
const router = express.Router();

const orderController = require('../controllers/order');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');
const isAdmin = require('../middleware/isAdmin');

// get all corporate clients
router.post(
  '/get-corporate-clients',
  passport.authenticate('jwt', { session: false }),
  orderController.getCorporateClients
);

//  get all users
// router.post('/get-all-users', passport.authenticate('jwt', { session: false }), orderController.getAllUsers);

// get all disinfectors for Order component
// router.get('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), orderController.getAllDisinfectors);

// create order
router.post(
  '/create-order',
  passport.authenticate('jwt', { session: false }),
  orderController.createOrder
);

// edit order
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  orderController.editOrder
);

// delete order
router.post(
  '/delete-order',
  passport.authenticate('jwt', { session: false }),
  orderController.deleteOrder
);

router.post(
  '/create-repeat-order',
  passport.authenticate('jwt', { session: false }),
  isOperatorOrAdmin,
  orderController.createRepeatOrder
);

// get orders for logged in disinfector or subadmin
router.post(
  '/get-my-orders',
  passport.authenticate('jwt', { session: false }),
  // isDisinfector, 
  orderController.getOrders
);

// add disinfector comment to order
router.post(
  '/addDisinfectorComment',
  passport.authenticate('jwt', { session: false }),
  orderController.addDisinfectorComment
);

// get order by id to fill out order completion form
router.post(
  '/get-order-by-id',
  passport.authenticate('jwt', { session: false }),
  orderController.getOrderById
);

router.post(
  '/search-orders',
  passport.authenticate('jwt', { session: false }),
  orderController.searchOrders
);

// order completion form is submitted
router.post(
  '/submit-complete-order',
  passport.authenticate('jwt', { session: false }),
  orderController.submitCompleteOrder
);

router.post(
  '/get-complete-order-in-month',
  passport.authenticate('jwt', { session: false }),
  orderController.getCompleteOrdersInMonth
)

// get events when materials were added to disinfector
router.post(
  '/get-add-material-events',
  passport.authenticate('jwt', { session: false }),
  orderController.getAddMaterialsEvents
);

router.post(
  '/dis-add-mat-to-other-user',
  passport.authenticate('jwt', { session: false }),
  orderController.disAddMatToOtherDis
);

router.post(
  '/get-returned-queries',
  passport.authenticate('jwt', { session: false }),
  orderController.getReturnedQueries
);

module.exports = router;