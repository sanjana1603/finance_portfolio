const dashboardModel = require('../modles/dashboard.models');

function getDashboardCountData(req, res) {
  dashboardModel.getInvestmentDistributionModel(req.body.userId)
    .then(data => {
      if(data.error){
        throw new Error(data.error);
      }
      console.log('Investment Distribution Data by Units:', data);
      res.status(200).json(data);
    })
    .catch(err => {
      console.log('Error fetching investment distribution data:', err);
      res.status(500).json({ error: 'Failed to fetch investment distribution data' });
    });
}

async function getDashboardAmountData(req, res) {
  await dashboardModel.getInvestmentDistributionModel(req.body.userId)
    .then(data => {
      data = data.map(async item => {
      // Fetching the price per unit for each company using an external API
      // Assuming the API returns the latest price for the company
        let price_per_unit_data =await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${item.company_name}&outputsize=compact&interval=5min&apikey=`+process.env.API_KEY);
        let price_per_unit_json = await price_per_unit_data.json();
        if (!price_per_unit_json['Time Series (5min)']) {
          throw new Error(`No price data found for ${item.company_name}`);
        }
        let price_per_unit = price_per_unit_json['Time Series (5min)'][Object.keys(price_per_unit_json['Time Series (5min)'])[0]]['1. open']; 
        return ({
        company_name: item.company_name,
        total_amount: item.units_remaining * price_per_unit
      })}
    );
      console.log('Investment Distribution Data by Amount', data);
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to fetch investment distribution data', err });
    });
}

async function getDateSeriesDataforUnitsBoughtSold(req, res) {
  const { userId } = req.body;
  const companyName = req.query.companyName;
  dashboardModel.getDateSeriesDataforUnitsBoughtSoldModel(userId, companyName)
  .then(data => {
    console.log('Aggregated date series data for each company', data);
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Error fetching date series data:', err);
    res.status(500).json({ error: 'Failed to fetch investment distribution data' });
  });
}


// This function aggregates the date series data for all companies
async function getDateSeriesDataforAllUnitsBoughtSold(req,res) {
  const { userId } = req.body;
  dashboardModel.getDateSeriesDataforAllUnitsBoughtSoldModel(userId)
  .then(data => {
    console.log('Aggregated date series data for all companies', data);
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Error fetching date series data:', err);
    res.status(500).json({ error: 'Failed to fetch investment distribution data' });
  });
}

module.exports = {
  getDashboardAmountData,
  getDashboardCountData,
  getDateSeriesDataforUnitsBoughtSold,
  getDateSeriesDataforAllUnitsBoughtSold
};
