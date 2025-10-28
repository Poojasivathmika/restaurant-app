const asyncHandler = require('express-async-handler');
const Food = require('../models/Food');

// @desc    Get all food items (Public)
// @route   GET /api/food
const getFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({});
  res.json(foods);
});

// @desc    Add a new food item (Owner Only - Protected)
// @route   POST /api/food
const addFood = asyncHandler(async (req, res) => {
  const { name, description, price, image } = req.body;

  const food = new Food({ name, description, price, image });
  const createdFood = await food.save();
  res.status(201).json(createdFood);
});

// @desc    Update a food item (Owner Only - Protected)
// @route   PUT /api/food/:id
const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (food) {
    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.image = req.body.image || food.image;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } else {
    res.status(404).json({ message: 'Food item not found' });
  }
});

// @desc    Delete a food item (Owner Only - Protected)
// @route   DELETE /api/food/:id
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (food) {
    await Food.deleteOne({ _id: food._id });
    res.json({ message: 'Food item removed' });
  } else {
    res.status(404).json({ message: 'Food item not found' });
  }
});

module.exports = { getFoods, addFood, updateFood, deleteFood };