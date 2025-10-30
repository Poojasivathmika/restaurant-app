const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// --- 1. DEFINE ALLOWED ORIGINS (FINAL CLEAN VERSION) ---
// This list now uses the stable production domain confirmed in Vercel settings.
const allowedOrigins = [
    'http://localhost:5173', // Your local development port
    // The permanent, stable Vercel URL:
    'https://pooja-restaurant-frontend.vercel.app' 
];
    
// --- 2. CONFIGURE CORS MIDDLEWARE ---
app.use(cors({
    origin: (origin, callback) => {
        // 1. Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true);

        // 2. Check if the incoming request origin is in the allowed list
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        
        // 3. If the origin is allowed, proceed
        return callback(null, true);
    },
    credentials: true, // Allows cookies and authorization headers to be sent
}));


// --- Other Middleware ---
app.use(express.json()); // Body parser middleware


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI) 
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));


// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/food', require('./routes/foodRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes')); 

// Basic route for the deployed Render server
app.get('/', (req, res) => {
    res.send('Restaurant API is running!');
});


// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
