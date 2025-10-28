const express = require('express');
const router = express.Router();
const { 
  getFoods, // <-- This function fetches the list
  addFood, 
  updateFood, 
  deleteFood 
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// 1. PUBLIC Route: Get all foods (This is the route that is hanging)
router.get('/', getFoods); 

// 2. Protected Routes (Owner Only)
router.post('/', protect, addFood);
router.put('/:id', protect, updateFood);
router.delete('/:id', protect, deleteFood);

module.exports = router;