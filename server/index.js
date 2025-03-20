const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const apiRoutes = require('./routes/api');
const videoRoutes = require('./routes/videoRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const dofRoutes = require('./routes/dofRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create necessary directories
const fs = require('fs');
const dirs = [
  path.join(__dirname, '../data'),
  path.join(__dirname, '../exports'),
  path.join(__dirname, '../uploads/videos'),
  path.join(__dirname, '../data/marketplace')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// API routes
app.use('/api', apiRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/dof', dofRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
