const VideoCallSession = require('../models/videoCallSession');

class VideoCallSessionService {
    async createSession(courseId) {
        const session = new VideoCallSession({
            courseId,
            startTime: new Date(),
            participants: [],
        });
        return await session.save();
    }

    async getSession(sessionId) {
        return await VideoCallSession.findById(sessionId);
    }

    async endSession(sessionId) {
        return await VideoCallSession.findByIdAndUpdate(
            sessionId,
            { endTime: new Date() },
            { new: true }
        );
    }

    async joinSession(sessionId, userId) {
        return await VideoCallSession.findByIdAndUpdate(
            sessionId,
            { $addToSet: { participants: userId } },
            { new: true }
        );
    }
}

module.exports = new VideoCallSessionService();