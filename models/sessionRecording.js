const mongoose = require('mongoose');

const SessionRecordingSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoCallSession',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  accessControl: {
    type: Object,
  },
});

module.exports = mongoose.model('SessionRecording', SessionRecordingSchema);
