const dbConn = require('../db/connections.db');
const executeQueries = require('./utility.migrations');
async function runMigrations() {
  try {
    const queries = [
      `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          demate_account_number VARCHAR(20) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          passwd VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL
        );
      `,
      `
       CREATE TABLE IF NOT EXISTS investments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        price_per_unit INT NOT NULL,
        total_amount INT NOT NULL,
        total_units INT NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        transaction_date DATE NOT NULL,      
        transaction_time TIME NOT NULL,    
        type ENUM('buy', 'sell') NOT NULL,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
      `,
      `CREATE TABLE IF NOT EXISTS bonds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bond_symbol VARCHAR(20) NOT NULL,
        bond_name VARCHAR(255) NOT NULL,
        price_per_unit DECIMAL(15,2) NOT NULL,
        total_units INT NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        type ENUM('buy','sell') NOT NULL,
        user_id INT NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_time TIME NOT NULL
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS metals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metal_symbol VARCHAR(20) NOT NULL,
        metal_name VARCHAR(255) NOT NULL,
        price_per_unit DECIMAL(15,2) NOT NULL,
        total_units INT NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        type ENUM('buy','sell') NOT NULL,
        user_id INT NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_time TIME NOT NULL
      );
      `,
      `
      INSERT IGNORE INTO users (demate_account_number, email, passwd, name)
      VALUES ('123456789', 'rk@gmail.com', '123', 'Ronak kumar');
      `
    ];

    const results = await executeQueries(dbConn,queries);

    // Logging the results from all queries
    results.forEach((res, index) => {
      console.log(`Query ${index + 1} executed successfully:`, res);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Migration process completed.');
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  console.log('Running migrations...');
  runMigrations().then(() => {
    console.log('Migrations completed successfully.');
    if (process.argv.includes('--end')) {
      dbConn.end(() => {
        console.log('Database connection closed.');
      });
      process.exit(0);
    }
  });
}

module.exports = runMigrations;