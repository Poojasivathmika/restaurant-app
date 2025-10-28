const express = require('express');
const router = express.Router();
const { ownerLogin, seedOwner, resetOwner } = require('../controllers/authController');

// Public Routes
router.post('/login', ownerLogin);

// Only expose seed/reset in non-production environments. Remove or secure these
// routes before making the app public.
if (process.env.NODE_ENV !== 'production') {
	// Seed Route (Run once, then remove or secure!)
	router.post('/seed', seedOwner);
	// Development helper: reset owner account to credentials in .env
	router.post('/reset', resetOwner);
}

module.exports = router;