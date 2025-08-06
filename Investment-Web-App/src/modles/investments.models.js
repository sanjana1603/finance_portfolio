const dbConnection = require('../db/connections.db');

const addInvestmentModel = async (investmentData) => {
    const { companyName, units, price, type, userId } = investmentData;
    const query = `
        INSERT INTO investments (price_per_unit,company_name, total_units, total_amount, type, user_id, transaction_date, transaction_time)
        VALUES (?,?, ?, ?, ?, ?, ?, NOW());
    `;
    try {
        const [rows] = await dbConnection.promise().query(query, [price,companyName, units, price * units, type, userId, new Date().toISOString().split('T')[0]]);
        console.log('Investment added successfully:', rows);
        return rows;
    } catch (error) {
        console.error('Error fetching investment distribution data:', error);
        throw error;
    }
}

const squareOffInvestmentModel = async (investmentData) => {
    const { companyName, units, price, type, userId } = investmentData;
    const query = `
        INSERT INTO investments (price_per_unit,company_name, total_units, total_amount, type, user_id, transaction_date, transaction_time)
        VALUES (?,?, ?, ?, ?, ?, ?, NOW());
    `;
    try {
        const [rows] = await dbConnection.promise().query(query, [price,companyName, units, price * units, type, userId, new Date().toISOString().split('T')[0]]);
        console.log('Investment squared off successfully:', rows);
        return rows;
    } catch (error) {
        console.error('Error fetching investment distribution data:', error);
        throw error;
    }
}

module.exports = {
    addInvestmentModel,
    squareOffInvestmentModel
};