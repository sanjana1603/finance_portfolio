require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middlewares/auth.middleware');
const app = express();
const bodyParser = require('body-parser');

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/investments', auth, require('./routes/investments.routes'));
app.use('/api/dashboard', auth, require('./routes/dashboard.routes'));
app.use('/api/bonds', auth, require('./routes/bonds.routes'));
app.use('/api/metals', auth, require('./routes/metals.routes'));

module.exports = app;
