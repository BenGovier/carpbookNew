const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lakeRoutes = require('./routes/lakeRoutes');
const fishRoutes = require('./routes/fishRoutes');

dotenv.config();

// Set Mongoose options to address deprecation warnings
mongoose.set('strictQuery', false);

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Carpbook API is running', path: req.path });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lakes', lakeRoutes);
app.use('/api/fish', fishRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Sorry, that route does not exist.' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

