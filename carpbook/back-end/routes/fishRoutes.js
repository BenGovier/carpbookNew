const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const fishController = require('../controllers/fishController');

// GET all fish
router.get('/', protect, fishController.getAllFish);

// POST a new fish
router.post('/', protect, fishController.createFish);

// GET a single fish by ID
router.get('/:id', protect, fishController.getFishById);

// PUT update a fish
router.put('/:id', protect, fishController.updateFish);

// DELETE a fish
router.delete('/:id', protect, fishController.deleteFish);

module.exports = router;

