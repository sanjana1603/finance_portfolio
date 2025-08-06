const router = require('express').Router();
const metalsController = require('../controllers/metals.controllers');

router.post('/buy', metalsController.addMetal);
router.post('/sell', metalsController.sellMetal);
router.get('/current-prices', metalsController.getMetalPrices);
router.get('/date-series-all', metalsController.getDateSeriesDataforAllMetalsBoughtSold);

module.exports = router;
