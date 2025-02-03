const Lake = require('../models/Lake');

exports.createLake = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);

    const { name, description, location } = req.body;
    const owner = req.user._id;

    if (!name) {
      return res.status(400).json({ message: 'Lake name is required' });
    }

    const lake = new Lake({
      name,
      description,
      location,
      owner
    });

    if (req.file) {
      lake.image = req.file.path;
    }

    await lake.save();
    console.log('Lake created successfully:', lake);
    res.status(201).json(lake);
  } catch (error) {
    console.error('Error creating lake:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getLakes = async (req, res) => {
  try {
    const lakes = await Lake.find({ owner: req.user._id });
    res.json(lakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLake = async (req, res) => {
  try {
    const lake = await Lake.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lake) {
      return res.status(404).json({ message: 'Lake not found' });
    }
    res.json(lake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLake = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const lake = await Lake.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lake) {
      return res.status(404).json({ message: 'Lake not found' });
    }

    lake.name = name || lake.name;
    lake.description = description || lake.description;
    lake.location = location || lake.location;

    if (req.file) {
      lake.image = req.file.path;
    }

    await lake.save();
    res.json(lake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLake = async (req, res) => {
  try {
    const lake = await Lake.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!lake) {
      return res.status(404).json({ message: 'Lake not found' });
    }
    res.json({ message: 'Lake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};