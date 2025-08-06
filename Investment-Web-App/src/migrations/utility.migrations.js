function executeQueries(dbConn, queries) {
    return new Promise((resolve, reject) => {
      let index = 0;
      const results = [];
  
      // Recursive function to execute queries one by one
      function executeNext() {
        if (index < queries.length) {
          console.log(`Executing query ${index + 1}...`);
          dbConn.query(queries[index], (err, res) => {
            if (err) {
              console.error(`Error in query ${index + 1}:`, err.message);
              reject(new Error(`Error executing query #${index + 1}: ${err.message}`));
              return;
            }
            results.push(res);  // Store the result
            console.log(`Query ${index + 1} completed successfully`);
            index++;
            executeNext();  // Execute the next query
          });
        } else {
          resolve(results);  // Return all the results once all queries are executed
        }
      }
  
      // Start executing queries
      executeNext();
    });
  }

  module.exports = executeQueries;