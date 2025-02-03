const mongoose = require('mongoose');

const lakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Lake', lakeSchema);

