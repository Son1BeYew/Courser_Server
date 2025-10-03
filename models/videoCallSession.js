const mongoose = require('mongoose');

const VideoCallSessionSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
  },
  participants: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('VideoCallSession', VideoCallSessionSchema);
