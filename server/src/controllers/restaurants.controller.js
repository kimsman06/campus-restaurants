// src/controllers/restaurants.controller.js
const restaurantService = require('../services/restaurants.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getRestaurants = asyncHandler(async (req, res) => {
  const { school, page = 1 } = req.query;
  const result = await restaurantService.getAllRestaurants(school, page);
  res.json(result);
});

exports.getRestaurantsSync = (req, res) => {
  const restaurants = restaurantService.getAllRestaurantsSync();
  res.json({
    data: restaurants,
    meta: {
      execution: 'synchronous'
    }
  });
};

exports.getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);

  if (!restaurant) {
    res.status(404).json({ error: { message: 'Restaurant not found' } });
    return;
  }

  res.json({ data: restaurant });
});

exports.getPopularRestaurants = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const restaurants = await restaurantService.getPopularRestaurants(limit);
  res.json({ data: restaurants });
});
