const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Import routes
const healthRoutes = require('./src/routes/health.routes');
const vehicleRoutes = require('./src/routes/vehicle.routes');
const escrowRoutes = require('./src/routes/escrow.routes');
const authRoutes = require('./src/routes/auth.routes');

// Use routes
app.use('/api/health', healthRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/auth', authRoutes);

// 0.0.0.0 permite que serviços externos na nuvem alcancem o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});