const { AccessToken } = require('livekit-server-sdk');

const createToken = async (roomName, participantName) => {
  try {
    console.log('🔷 Creating LiveKit token...');
    console.log('🔷 Room Name:', roomName);
    console.log('🔷 Participant Name:', participantName);
    console.log('🔷 API Key:', process.env.LIVEKIT_API_KEY ? 'Present' : 'Missing');
    console.log('🔷 API Secret:', process.env.LIVEKIT_API_SECRET ? 'Present' : 'Missing');

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      throw new Error('LiveKit API Key or Secret is not configured');
    }

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });

    let token = at.toJwt();
    console.log('🔷 Token type before await:', typeof token);
    console.log('🔷 Token is Promise?:', token instanceof Promise);
    
    // If it's a promise, await it
    if (token instanceof Promise) {
      console.log('🔷 Token is a Promise, awaiting...');
      token = await token;
    }
    
    console.log('🔷 Token type after await:', typeof token);
    console.log('🔷 Token value:', token);
    console.log('🔷 Token length:', token?.length);
    console.log('✅ LiveKit token created successfully');
    
    // Ensure token is a string
    if (typeof token !== 'string') {
      console.error('❌ Token is not a string, it is:', typeof token);
      console.error('❌ Token value:', JSON.stringify(token));
      throw new Error('Token generation failed - not a string');
    }
    
    return token;
  } catch (error) {
    console.error('❌ Error creating LiveKit token:', error.message);
    throw error;
  }
};

module.exports = { createToken };
