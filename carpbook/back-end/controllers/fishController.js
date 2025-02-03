const Fish = require('../models/Fish');

// Get all fish
exports.getAllFish = async (req, res) => {
  try {
    const fish = await Fish.find({ owner: req.user._id });
    res.json(fish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new fish
exports.createFish = async (req, res) => {
  const fish = new Fish({
    ...req.body,
    owner: req.user._id
  });

  try {
    const newFish = await fish.save();
    res.status(201).json(newFish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single fish by ID
exports.getFishById = async (req, res) => {
  try {
    const fish = await Fish.findOne({ _id: req.params.id, owner: req.user._id });
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json(fish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a fish
exports.updateFish = async (req, res) => {
  try {
    const fish = await Fish.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json(fish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a fish
exports.deleteFish = async (req, res) => {
  try {
    const fish = await Fish.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json({ message: 'Fish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

