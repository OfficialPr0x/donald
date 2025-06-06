const { handy } = require('../services/handyService');
const { supabase } = require('../services/supabaseService');

async function pairDevice(req, res, next) {
  try {
    const { userId, connectionKey } = req.body;
    if (!userId || !connectionKey) return res.status(400).json({ error: 'userId and connectionKey required' });
    // Validate with Handy API
    const valid = await handy.validateKey(connectionKey);
    if (!valid) return res.status(400).json({ error: 'Invalid Handy connection key' });
    // Store in user profile
    await supabase.from('profiles').update({ handy_key: connectionKey }).eq('id', userId);
    res.json({ message: 'Device paired successfully' });
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    const status = await handy.getStatus(data.handy_key);
    res.json({ status });
  } catch (err) {
    next(err);
  }
}

async function controlDevice(req, res, next) {
  try {
    const { userId, command, params } = req.body;
    if (!userId || !command) return res.status(400).json({ error: 'userId and command required' });
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    const result = await handy.sendCommand(data.handy_key, command, params);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

module.exports = { pairDevice, getStatus, controlDevice }; 