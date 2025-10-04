const VideoCallSession = require('../models/videoCallSession');

exports.createSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ msg: 'courseId is required' });
    }
    const newSession = new VideoCallSession({ courseId });
    await newSession.save();

    // Transform the response to match the contract
    const responseObj = {
      sessionId: newSession._id,
      courseId: newSession.courseId,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      participants: newSession.participants,
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await VideoCallSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    const responseObj = {
      sessionId: session._id,
      courseId: session.courseId,
      startTime: session.startTime,
      endTime: session.endTime,
      participants: session.participants,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await VideoCallSession.findByIdAndDelete(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.joinSession = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ msg: 'userId is required' });
    }
    const session = await VideoCallSession.findByIdAndUpdate(
      req.params.sessionId,
      { $addToSet: { participants: userId } },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(200).json({ msg: 'User joined session successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const SessionRecordingService = require('../services/sessionRecordingService');

exports.startRecording = async (req, res) => {
  try {
    const recording = await SessionRecordingService.startRecording(req.params.sessionId);
    res.status(201).json(recording);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const LiveKitService = require('../services/LiveKitService');

exports.getToken = async (req, res) => {
  try {
    console.log('🔵 getToken endpoint called');
    const { sessionId } = req.params;
    const { userId } = req.body;
    console.log('🔵 SessionId:', sessionId);
    console.log('🔵 UserId:', userId);
    console.log('🔵 Request body:', req.body);

    if (!userId) {
      console.log('⚠️ userId is missing');
      return res.status(400).json({ msg: 'userId is required' });
    }

    const token = await LiveKitService.createToken(sessionId, userId);
    console.log('✅ Token created successfully');
    console.log('✅ Token type in controller:', typeof token);
    res.status(200).json({ token });
  } catch (err) {
    console.error('❌ Error in getToken:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.stopRecording = async (req, res) => {
  try {
    const { recordingId } = req.body;
    if (!recordingId) {
      return res.status(400).json({ msg: 'recordingId is required' });
    }
    const recording = await SessionRecordingService.stopRecording(req.body.recordingId);
    res.status(200).json(recording);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
