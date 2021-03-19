const express = require('express');
const passport = require('passport');
const router = express.Router();

const statsController = require('../controllers/stats');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');
const isAdmin = require('../middleware/isAdmin');


// stats for disinfector
router.post('/disinfector-sees-his-own-stats', passport.authenticate('jwt', { session: false }), statsController.disinfectorGetsHisOwnStats);

// общая статистика
router.post('/for-admin-general', passport.authenticate('jwt', { session: false }), isAdmin, statsController.genStatsForAdmin);

// статистика дезинфектора для админа
router.post('/for-admin-disinfector-stats', passport.authenticate('jwt', { session: false }), isAdmin, statsController.disinfectorStatsForAdmin);

router.post('/adv-stats', passport.authenticate('jwt', { session: false }), isAdmin, statsController.getAdvStats);

router.post('/operator-stats', passport.authenticate('jwt', { session: false }), isAdmin, statsController.getOperatorStats);

router.post('/get-user-mat-coming', passport.authenticate('jwt', { session: false }), statsController.getUserMatComing);

router.post('/get-user-mat-distrib', passport.authenticate('jwt', { session: false }), statsController.getUserMatDistrib);

module.exports = router;