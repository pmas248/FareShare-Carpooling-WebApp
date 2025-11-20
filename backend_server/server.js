require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');

const userRoutes    = require('./routes/users');
const rideRoutes    = require('./routes/rides');
const groupRoutes   = require('./routes/groups');
const historyRoutes = require('./routes/history');
const driverRoutes  = require('./routes/drivers');
const reviewRoutes  = require('./routes/reviews');

const app = express();

dbConnect();
// health‐check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Enable CORS only from your frontend URL
app.use(cors({origin: process.env.FRONTEND_URL}));


app.use(express.json());
app.use('/api/users',   userRoutes);
app.use('/api/rides',   rideRoutes);
app.use('/api/groups',  groupRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// only connect & listen when run directly, not when required by Jest
if (require.main === module) {
  dbConnect();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;