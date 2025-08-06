const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controllers');

router.get('/amount', dashboardController.getDashboardAmountData);
router.get('/units', dashboardController.getDashboardCountData);
router.get('/date-series', dashboardController.getDateSeriesDataforUnitsBoughtSold);
router.get('/date-series-all', dashboardController.getDateSeriesDataforAllUnitsBoughtSold);

module.exports = router;