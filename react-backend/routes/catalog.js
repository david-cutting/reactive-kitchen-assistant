const express = require('express');
const router = express.Router();

// Require controller modules
const fooditem_controller = require('../controllers/foodItemController');

/// ROUTES ///

// POST request for creation
router.post('/create', fooditem_controller.fooditem_create_post);

module.exports = router;