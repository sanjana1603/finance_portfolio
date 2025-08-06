const router = require('express').Router();
const investmentController = require('../controllers/investments.controllers');

router.post('/add', investmentController.addInvestment);
router.post('/squareOff', investmentController.squareOffInvestment);

module.exports = router;