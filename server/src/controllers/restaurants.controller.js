// src/controllers/restaurants.controller.js
const restaurantService = require('../services/restaurants.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getRestaurants = asyncHandler(async (req, res) => {
  const { school, page = 1 } = req.query;
  const result = await restaurantService.getAllRestaurants(school, page);
  res.json(result);
});
