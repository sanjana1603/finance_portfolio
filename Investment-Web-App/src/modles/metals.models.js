const db = require('../db/connections.db');

// Insert metal record
async function addMetalModel(metalData) {
    const sql = `
        INSERT INTO metals 
        (metal_symbol, metal_name, total_units, price_per_unit, total_amount, type, user_id, transaction_date, transaction_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME());
    `;
    const params = [
        metalData.symbol,
        metalData.metalName,
        metalData.units,
        metalData.price,
        metalData.total_amount = metalData.price * metalData.units,
        metalData.type = 'buy',
        metalData.userId
    ];
    try {
        const [rows] = await db.promise().query(sql, params);
        return rows;
    } catch (err) {
        console.error("Error adding metal:", err);
        throw err;
    }
}

async function sellMetalModel(metalData) {
    const sql = `
        INSERT INTO metals 
        (metal_symbol, metal_name, total_units, price_per_unit, total_amount, type, user_id, transaction_date, transaction_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME());
    `;
    const params = [
        metalData.symbol,
        metalData.metalName,
        metalData.units,
        metalData.price,
        metalData.total_amount = metalData.price * metalData.units,
        metalData.type = 'sell',
        metalData.userId
    ];
    try {
        const [rows] = await db.promise().query(sql, params);
        return rows;
    } catch (err) {
        console.error("Error selling metal:", err);
        throw err;
    }
}

// Get distinct metals with units remaining
async function getOwnedMetalsModel(userId) {
    const sql = `
        SELECT 
            metal_symbol,
            metal_name,
            COALESCE(SUM(CASE WHEN type='buy' THEN total_units ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN type='sell' THEN total_units ELSE 0 END), 0) AS units_remaining
        FROM metals
        WHERE user_id = ?
        GROUP BY metal_symbol, metal_name
        HAVING units_remaining > 0;
    `;
    const params = [userId];
    try {
        const [rows] = await db.promise().query(sql, params);
        return rows;
    } catch (err) {
        console.error("Error fetching owned metals:", err);
        throw err;
    }
}

// Get date series data for all metals bought/sold
const getDateSeriesDataforAllMetalsBoughtSoldModel = async (userId) => {
    const query = `
        WITH RECURSIVE date_series AS (
            SELECT MIN(transaction_date) AS dt
            FROM metals
            WHERE user_id = ?
            UNION ALL
            SELECT DATE_ADD(dt, INTERVAL 1 DAY)
            FROM date_series
            WHERE dt < (SELECT MAX(transaction_date) FROM metals WHERE user_id = ?)
        ),
        metals_list AS (
            SELECT DISTINCT metal_name FROM metals WHERE user_id = ?
        ),
        types AS (
            SELECT 'buy' AS type
            UNION ALL
            SELECT 'sell'
        ),
        metal_type_date AS (
            SELECT 
                d.dt AS transaction_date,
                m.metal_name,
                t.type
            FROM date_series d
            CROSS JOIN metals_list m
            CROSS JOIN types t
        )
        SELECT 
            mtd.transaction_date,
            mtd.metal_name,
            mtd.type,
            COALESCE(SUM(mt.total_units), 0) AS total_units,
            COALESCE(SUM(mt.total_amount), 0) AS total_amount
        FROM metal_type_date mtd
        LEFT JOIN metals mt
            ON mt.transaction_date = mtd.transaction_date
        AND mt.metal_name = mtd.metal_name
        AND mt.type = mtd.type
        AND mt.user_id = ?
        WHERE total_units > 0
        GROUP BY mtd.transaction_date, mtd.metal_name, mtd.type
        ORDER BY mtd.transaction_date, mtd.metal_name, mtd.type;
    `;
    try {
        const [rows] = await db.promise().query(query, [
            userId,
            userId,
            userId,
            userId
        ]);
        return rows;
    } catch (error) {
        console.error('Error fetching metals date series data:', error);
        throw error;
    }
};

module.exports = {
    addMetalModel,
    getOwnedMetalsModel,
    getDateSeriesDataforAllMetalsBoughtSoldModel,
    sellMetalModel
};