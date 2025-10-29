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

// ✅ Allowed origins (your frontend + local dev)
const allowedOrigins = [
  'https://pooja-restaurant-frontend.vercel.app', // your live frontend
  'http://localhost:5173', // local dev
  'http://localhost:5174'  // sometimes Vite uses this port
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., backend test tools or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ Import routes
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Use routes
app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
