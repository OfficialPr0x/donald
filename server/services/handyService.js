const axios = require('axios');

const HANDY_API = 'https://www.handyfeeling.com/api/v2';

const handy = {
  async validateKey(connectionKey) {
    try {
      const res = await axios.post(`${HANDY_API}/oauth/handshake`, { connectionKey });
      return res.data && res.data.success;
    } catch (err) {
      return false;
    }
  },
  async getStatus(connectionKey) {
    try {
      const res = await axios.get(`${HANDY_API}/connection/status?connectionKey=${connectionKey}`);
      return res.data;
    } catch (err) {
      throw new Error('Failed to get device status');
    }
  },
  async sendCommand(connectionKey, command, params) {
    try {
      // Map command to Handy API endpoint
      let url, method = 'post', data = { connectionKey, ...params };
      switch (command) {
        case 'stroke_position':
          url = `${HANDY_API}/stroke/position`;
          break;
        case 'stroke_v2':
          url = `${HANDY_API}/stroke/v2`;
          break;
        case 'stroke_preset':
          url = `${HANDY_API}/stroke/preset`;
          break;
        case 'pause':
          url = `${HANDY_API}/pause`;
          break;
        case 'stop':
          url = `${HANDY_API}/stop`;
          break;
        default:
          throw new Error('Unknown command');
      }
      const res = await axios({ url, method, data });
      return res.data;
    } catch (err) {
      throw new Error('Failed to send device command');
    }
  }
};

module.exports = { handy }; 