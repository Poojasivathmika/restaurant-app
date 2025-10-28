const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Body parser for JSON

// ✅ Step 1: Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // local dev frontend
  'http://localhost:5174', // sometimes Vite uses another port
  'https://pooja-restaurant-frontend-8vxkgbu48.vercel.app' // deployed frontend
];

// ✅ Step 2: Setup CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// ✅ Step 3: Import routes
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Step 4: Use routes
app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// ✅ Step 5: Test route
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// ✅ Step 6: Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
