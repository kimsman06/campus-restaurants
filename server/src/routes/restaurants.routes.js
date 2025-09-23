// src/routes/restaurants.routes.js
const express = require('express');
const restaurantsController = require('../controllers/restaurants.controller');

const router = express.Router();

router.get('/', restaurantsController.getRestaurants);

module.exports = router;
