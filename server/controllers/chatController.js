const { venice } = require('../services/veniceService');
const { handy } = require('../services/handyService');
const { parseIntent } = require('../nlp/intentParser');

async function sendMessage(req, res, next) {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'userId and message required' });
    // Get AI response
    const aiResponse = await venice.chat(message, userId);
    // Parse intent
    const intent = parseIntent(aiResponse.text);
    // Map intent to device action
    let deviceResult = null;
    if (intent && intent.command) {
      deviceResult = await handy.sendCommand(aiResponse.deviceKey, intent.command, intent.params);
    }
    res.json({ text: aiResponse.text, audio: aiResponse.audio, intent, deviceResult });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage }; 