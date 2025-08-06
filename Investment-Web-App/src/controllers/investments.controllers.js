const investmentModel = require('../modles/investments.models');

function addInvestment(req, res) {
    const investmentData = req.body;
    console.log('Investment Data:', investmentData);
    if(!investmentData || !investmentData.companyName || investmentData.units==undefined || !investmentData.price || !investmentData.type || !investmentData.userId) {
        console.error('Invalid investment data:', investmentData);
        return res.status(400).json({ error: 'Invalid investment data' });
    }
    investmentModel.addInvestmentModel(investmentData)
        .then(result => {
          console.log('Investment added successfully:', result);
        res.status(201).json({ message: 'Investment added successfully', data: result });
        })
        .catch(err => {
        console.error('Error adding investment:', err);
        res.status(500).json({ error: 'Failed to add investment' });
        });
}

function squareOffInvestment(req, res) {
  const investmentData = req.body;
    console.log('Investment Data:', investmentData);
    if(!investmentData || !investmentData.companyName || investmentData.units==undefined || !investmentData.price || !investmentData.type || !investmentData.userId) {
        console.error('Invalid investment data:', investmentData);
        return res.status(400).json({ error: 'Invalid investment data' });
    }
    investmentModel.squareOffInvestmentModel(investmentData)
        .then(result => {
          console.log('Investment squared off successfully:', result);
        res.status(200).json({ message: 'Investment squared off successfully', data: result });
        })
        .catch(err => {
        console.error('Error squaring off investment:', err);
        res.status(500).json({ error: 'Failed to square off investment' });
        });
}

module.exports = {
  addInvestment,
  squareOffInvestment
};