const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables from the backend folder explicitly so the app works
// even when started from a different current working directory.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON
// Allow CORS from local frontend dev server(s).
// During development the frontend may run on 5173, 5174, etc. Accept any http://localhost:<port> origin.
// Allow CORS from local development OR a configured FRONTEND_URL (set this in Render/Vercel)
const allowedFrontend = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl or server-to-server)
      if (!origin) return callback(null, true);
      // Accept any localhost origin (http://localhost:PORT)
      try {
        const u = new URL(origin);
        if (u.hostname === 'localhost') return callback(null, true);
      } catch (e) {
        // fallthrough to other checks
      }
      // Accept the configured frontend origin exactly
      if (allowedFrontend && origin === allowedFrontend) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Routes
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));