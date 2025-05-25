const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gridData: {
    type: Array,
    required: true
  },
  startNode: {
    type: Object,
    required: true
  },
  endNode: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grid', gridSchema);
