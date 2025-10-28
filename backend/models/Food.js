// backend/models/Food.js

const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },      // Use String
  description: { type: String, required: true }, // Use String
  price: { type: Number, required: true },       // Use Number
  image: { type: String, default: 'placeholder.jpg' } // Use String
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);