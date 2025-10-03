
const SessionRecordingService = require('../services/sessionRecordingService');

exports.getRecording = async (req, res) => {
  try {
    const recording = await SessionRecordingService.getRecording(req.params.recordingId);
    if (!recording) {
      return res.status(404).json({ msg: 'Recording not found' });
    }
    res.status(200).json(recording);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
