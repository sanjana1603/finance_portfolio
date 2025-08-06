const { 
    addMetalModel, 
    getOwnedMetalsModel, 
    sellMetalModel, 
    getDateSeriesDataforAllMetalsBoughtSoldModel 
} = require('../modles/metals.models');
const yahooFinance = require('yahoo-finance2').default;

async function addMetal(req, res) {
    try {
        const metalData = req.body;
        console.log("Adding metal data:", metalData);
        if (!metalData.symbol || metalData.units===undefined || metalData.price === undefined || !metalData.userId) {
            return res.status(400).json({ error: "Invalid metal data" });
        }
        const result = await addMetalModel(metalData);
        res.status(201).json({ message: "Metal added successfully", result });
    } catch (err) {
        console.error("Error adding metal:", err);
        res.status(500).json({ error: "Failed to add metal" });
    }
}

async function sellMetal(req, res) {
    try {
        const metalData = req.body;
        if (!metalData.symbol || !metalData.units || metalData.price === undefined || !metalData.userId) {
            return res.status(400).json({ error: "Invalid metal data" });
        }
        const result = await sellMetalModel(metalData);
        res.status(200).json({ message: "Metal sold successfully", result });
    } catch (err) {
        console.error("Error selling metal:", err);
        res.status(500).json({ error: "Failed to sell metal" });
    }
}

async function getMetalPrices(req, res) {
    try {
        const userId = req.body.userId;
        const ownedMetals = await getOwnedMetalsModel(userId);

        if (!ownedMetals || ownedMetals.length === 0) {
            return res.json([]);
        }

        // Fetch prices from yahoo-finance2
        const symbols = ownedMetals.map(m => m.metal_symbol);
        const quotes = await yahooFinance.quote(symbols);

        // Map results with price & total value
        const enrichedData = ownedMetals.map(m => {
            const q = Array.isArray(quotes)
                ? quotes.find(item => item.symbol === m.metal_symbol)
                : quotes; // single result case
            const price = q?.regularMarketPrice || 0;
            return {
                metal_symbol: m.metal_symbol,
                metal_name: m.metal_name,
                units_remaining: m.units_remaining,
                current_price: price,
                total_amount: price * m.units_remaining,
                previous_price: m.price || 0,
                previous_total_amount: m.total_amount || 0,
            };
        });

        res.json(enrichedData);
    } catch (err) {
        console.error("Error fetching metal prices:", err);
        res.status(500).json({ error: "Failed to fetch metal prices" });
    }
}

async function getDateSeriesDataforAllMetalsBoughtSold(req, res) {
    const { userId } = req.body;
  
    getDateSeriesDataforAllMetalsBoughtSoldModel(userId)
      .then(data => {
        console.log('Aggregated date series data for all metals', data);
        res.status(200).json(data);
      })
      .catch(err => {
        console.error('Error fetching metals date series data:', err);
        res.status(500).json({ error: 'Failed to fetch metals date series data' });
      });
}

module.exports = {
    addMetal,
    getMetalPrices,
    getDateSeriesDataforAllMetalsBoughtSold,
    sellMetal
};
