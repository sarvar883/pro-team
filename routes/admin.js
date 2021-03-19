const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/isAdmin');
const isAdminOrSubadmin = require('../middleware/isAdminOrSubadmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getSortedOrders);

router.post('/get-order-queries-for-admin', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOrderQueriesForAdmin);

router.post('/admin-confirms-order-query', passport.authenticate('jwt', { session: false }), isAdmin, adminController.confirmOrderQuery);

router.post('/get-all-disinfectors-and-subadmins', passport.authenticate('jwt', { session: false }), adminController.getDisinfectorsAndSubadmins);

router.post('/get-all-operators', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOperators);

router.post('/get-all-operators-and-admins', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOperatorsAndAdmins);

router.post('/add-materials-to-disinfector', passport.authenticate('jwt', { session: false }), adminController.addMaterialToDisinfector);

router.post('/get-add-material-events', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMaterialEvents);

router.post('/get-current-materials', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getCurMat);

router.post('/add-mat-coming', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatComing);


router.post('/get-mat-coming', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getMaterialComingEvents);

router.post('/add-client', passport.authenticate('jwt', { session: false }), adminController.addClient);

router.post('/edit-client', passport.authenticate('jwt', { session: false }), adminController.editClient);

router.post('/change-contract-numbers', passport.authenticate('jwt', { session: false }), adminController.changeContractNumbers);

router.post('/search-clients', passport.authenticate('jwt', { session: false }), adminController.searchClients);

router.post('/client-by-id', passport.authenticate('jwt', { session: false }), adminController.clientById);

router.post('/get-orders-of-client', passport.authenticate('jwt', { session: false }), adminController.getOrdersOfClient);

router.post('/new-material', passport.authenticate('jwt', { session: false }), adminController.addNewMaterial);

module.exports = router;