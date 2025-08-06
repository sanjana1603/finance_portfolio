const { addBondModel, getOwnedBondsModel, sellBondModel, getDateSeriesDataforAllBondsBoughtSoldModel } = require('../modles/bonds.models');
const yahooFinance = require('yahoo-finance2').default;

// POST /api/bonds/add
async function addBond(req, res) {
    try {
        const bondData = req.body;
        if (!bondData.symbol || !bondData.units || bondData.price === undefined || !bondData.userId) {
            return res.status(400).json({ error: "Invalid bond data" });
        }
        const result = await addBondModel(bondData);
        res.status(201).json({ message: "Bond added successfully", result });
    } catch (err) {
        console.error("Error adding bond:", err);
        res.status(500).json({ error: "Failed to add bond" });
    }
}

async function sellBond(req, res) {
    try {
        const bondData = req.body;
        if (!bondData.symbol || !bondData.units || bondData.price === undefined || !bondData.userId) {
            return res.status(400).json({ error: "Invalid bond data" });
        }
        const result = await sellBondModel(bondData);
        res.status(200).json({ message: "Bond sold successfully", result });
    } catch (err) {
        console.error("Error selling bond:", err);
        res.status(500).json({ error: "Failed to sell bond" });
    }
}

async function getBondPrices(req, res) {
    try {
        const userId = req.body.userId;
        const ownedBonds = await getOwnedBondsModel(userId);

        if (!ownedBonds || ownedBonds.length === 0) {
            return res.json([]);
        }

        // Fetch prices from yahoo-finance2
        const symbols = ownedBonds.map(b => b.bond_symbol);
        const quotes = await yahooFinance.quote(symbols);

        // Map results with price & total value
        const enrichedData = ownedBonds.map(b => {
            const q = Array.isArray(quotes)
                ? quotes.find(item => item.symbol === b.bond_symbol)
                : quotes; // single result case
            const price = q?.regularMarketPrice || 0;
            return {
                bond_symbol: b.bond_symbol,
                bond_name: b.bond_name,
                units_remaining: b.units_remaining,
                current_price: price,
                total_amount: price * b.units_remaining,
                previous_price: b.price || 0,
                previous_total_amount: b.total_amount || 0,
            };
        });

        res.json(enrichedData);
    } catch (err) {
        console.error("Error fetching bond prices:", err);
        res.status(500).json({ error: "Failed to fetch bond prices" });
    }
}

async function getDateSeriesDataforAllBondsBoughtSold(req, res) {
  const { userId } = req.body;
  
  getDateSeriesDataforAllBondsBoughtSoldModel(userId)
    .then(data => {
      console.log('Aggregated date series data for all bonds', data);
      res.status(200).json(data);
    })
    .catch(err => {
      console.error('Error fetching bonds date series data:', err);
      res.status(500).json({ error: 'Failed to fetch bonds date series data' });
    });
}

module.exports = {
    addBond,
    getBondPrices,
    getDateSeriesDataforAllBondsBoughtSold,
    sellBond
};
