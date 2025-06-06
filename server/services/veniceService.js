const axios = require('axios');

const VENICE_API = process.env.VENICE_API_URL;
const VENICE_KEY = process.env.VENICE_API_KEY;

const venice = {
  async chat(message, userId) {
    try {
      const res = await axios.post(
        `${VENICE_API}/chat`,
        { message, userId },
        { headers: { Authorization: `Bearer ${VENICE_KEY}` } }
      );
      return res.data; // { text, audio, deviceKey }
    } catch (err) {
      throw new Error('Failed to get AI response');
    }
  }
};

module.exports = { venice }; 