
const router = require('express').Router();
const bondsController = require('../controllers/bonds.controllers');

router.post('/buy', bondsController.addBond);
router.post('/sell', bondsController.sellBond);
router.get('/current-prices', bondsController.getBondPrices);
router.get('/date-series-all', bondsController.getDateSeriesDataforAllBondsBoughtSold);

module.exports = router;
