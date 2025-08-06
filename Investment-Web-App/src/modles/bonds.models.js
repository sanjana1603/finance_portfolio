const db = require('../db/connections.db');
// Insert bond record
async function addBondModel(bondData) {
        const sql = `
            INSERT INTO bonds 
            (bond_symbol, bond_name, total_units, price_per_unit, total_amount, type, user_id, transaction_date, transaction_time)
            VALUES (?, ?, ?, ?, ?, ?,?, CURDATE(), CURTIME());
        `;
        const params = [
            bondData.symbol,
            bondData.name,
            bondData.units,
            bondData.price,
            bondData.total_amount = bondData.price * bondData.units,
            bondData.type = 'buy',
            bondData.userId
        ];
        try {
            const [rows] = await db.promise().query(sql, params);
            return rows;
        } catch (err) {
            console.error("Error adding bond:", err);
            throw err;
        }
}

async function sellBondModel(bondData) {
        const sql = `
            INSERT INTO bonds 
            (bond_symbol, bond_name, total_units, price_per_unit, total_amount, type, user_id, transaction_date, transaction_time)
            VALUES (?, ?, ?, ?, ?, ?,?, CURDATE(), CURTIME());
        `;
        const params = [
           bondData.symbol,
            bondData.name,
            bondData.units,
            bondData.price,
            bondData.total_amount = bondData.price * bondData.units,
            bondData.type = 'sell',
            bondData.userId
        ];
        try {
            const [rows] = await db.promise().query(sql, params);
            return rows;
        } catch (err) {
            console.error("Error selling bond:", err);
            throw err;
        }
}

// Get distinct bonds with units remaining
async function getOwnedBondsModel(userId) {
   const sql = `
            SELECT 
                bond_symbol,
                bond_name,
                COALESCE(SUM(CASE WHEN type='buy' THEN total_units ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN type='sell' THEN total_units ELSE 0 END), 0) AS units_remaining
            FROM bonds
            WHERE user_id = ?
            GROUP BY bond_symbol, bond_name
            HAVING units_remaining > 0;
        `;
        const params = [userId];
        try {
            const [rows] = await db.promise().query(sql, params);
            return rows;
        } catch (err) {
            console.error("Error fetching owned bonds:", err);
            throw err;
        }
    }


const getDateSeriesDataforAllBondsBoughtSoldModel = async (userId) => {
    const query = `
        WITH RECURSIVE date_series AS (
            SELECT MIN(transaction_date) AS dt
            FROM bonds
            WHERE user_id = ?
            UNION ALL
            SELECT DATE_ADD(dt, INTERVAL 1 DAY)
            FROM date_series
            WHERE dt < (SELECT MAX(transaction_date) FROM bonds WHERE user_id = ?)
        ),
        bonds_list AS (
            SELECT DISTINCT bond_name FROM bonds WHERE user_id = ?
        ),
        types AS (
            SELECT 'buy' AS type
            UNION ALL
            SELECT 'sell'
        ),
        bond_type_date AS (
            SELECT 
                d.dt AS transaction_date,
                b.bond_name,
                t.type
            FROM date_series d
            CROSS JOIN bonds_list b
            CROSS JOIN types t
        )
        SELECT 
            btd.transaction_date,
            btd.bond_name,
            btd.type,
            COALESCE(SUM(bn.total_units), 0) AS total_units,
            COALESCE(SUM(bn.total_amount), 0) AS total_amount
        FROM bond_type_date btd
        LEFT JOIN bonds bn
            ON bn.transaction_date = btd.transaction_date
        AND bn.bond_name = btd.bond_name
        AND bn.type = btd.type
        AND bn.user_id = ?
        WHERE total_units > 0
        GROUP BY btd.transaction_date, btd.bond_name, btd.type
        ORDER BY btd.transaction_date, btd.bond_name, btd.type;
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
        console.error('Error fetching bonds date series data:', error);
        throw error;
    }
};

module.exports = {
    addBondModel,
    getOwnedBondsModel,
    getDateSeriesDataforAllBondsBoughtSoldModel,
    sellBondModel
};


      