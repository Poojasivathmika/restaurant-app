// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from backend/.env (if present)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Body parser for JSON
app.use(express.json());

// -----------------------------
// CORS configuration
// -----------------------------
// Allow the exact Vercel frontend URL your app is using plus local dev ports.
// IMPORTANT: include the exact Vercel subdomain (the -8hv2v8ad8 part)
const allowedOrigins = [
 'https://pooja-restaurant-frontend.vercel.app',          // main frontend
  'https://pooja-restaurant-frontend-i0qp3pyws.vercel.app', // temporary Vercel deployment
  'http://localhost:5173',
  'http://localhost:5174' // alternative Vite port
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// -----------------------------
// Import & mount routes
// -----------------------------
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// Health route for easy checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
