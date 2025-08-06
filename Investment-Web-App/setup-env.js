const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=investment_db
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the DB_PASSWORD in the .env file with your actual MySQL password');
} else {
  console.log('⚠️  .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update the DB_PASSWORD in .env file with your MySQL password');
console.log('2. Make sure MySQL is running and the database "investment_db" exists');
console.log('3. Run: npm run migrate');
console.log('4. Run: npm run dev'); 