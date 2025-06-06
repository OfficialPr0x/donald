const { handy } = require('../services/handyService');
const { supabase } = require('../services/supabaseService');

/**
 * Pair a Handy device with a user account
 */
async function pairDevice(req, res, next) {
  try {
    const { userId, connectionKey } = req.body;
    if (!userId || !connectionKey) return res.status(400).json({ error: 'userId and connectionKey required' });
    
    // Validate with Handy API
    const valid = await handy.validateKey(connectionKey);
    if (!valid) return res.status(400).json({ error: 'Invalid Handy connection key or device needs firmware update' });
    
    // Get device info
    const deviceInfo = await handy.getInfo(connectionKey);
    
    // Store in user profile
    await supabase.from('profiles').update({ 
      handy_key: connectionKey,
      handy_hw_version: deviceInfo.hwVersion,
      handy_fw_version: deviceInfo.fwVersion,
      last_connected: new Date().toISOString()
    }).eq('id', userId);
    
    res.json({ 
      message: 'Device paired successfully',
      deviceInfo
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get device connection status and information
 */
async function getStatus(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Check if device is connected
    const connected = await handy.isConnected(connectionKey);
    if (!connected) {
      return res.json({ 
        connected: false,
        message: 'Device is not connected'
      });
    }
    
    // Get device info
    const deviceInfo = await handy.getInfo(connectionKey);
    
    // Get device mode
    const modeInfo = await handy.getMode(connectionKey);
    
    // Get slide settings
    const slideSettings = await handy.getSlideSettings(connectionKey);
    
    // Return comprehensive device status
    res.json({
      connected: true,
      deviceInfo,
      mode: modeInfo,
      slide: slideSettings
    });
  } catch (err) {
    console.error('Error getting device status:', err);
    next(err);
  }
}

/**
 * Control device through various commands
 */
async function controlDevice(req, res, next) {
  try {
    const { userId, command, params } = req.body;
    if (!userId || !command) return res.status(400).json({ error: 'userId and command required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Execute the command
    const result = await handy.sendCommand(connectionKey, command, params);
    
    // Update last activity timestamp
    await supabase.from('profiles').update({ 
      last_device_activity: new Date().toISOString() 
    }).eq('id', userId);
    
    res.json({ result });
  } catch (err) {
    console.error('Error controlling device:', err);
    next(err);
  }
}

/**
 * Update device firmware status
 */
async function checkFirmware(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Get device info including firmware status
    const deviceInfo = await handy.getInfo(connectionKey);
    
    // Return firmware status information
    let updateRequired = false;
    let updateMessage = '';
    
    switch(deviceInfo.fwStatus) {
      case 0:
        updateMessage = 'Firmware is up to date';
        break;
      case 1:
        updateMessage = 'Firmware update available';
        break;
      case 2:
        updateRequired = true;
        updateMessage = 'Firmware update required';
        break;
      default:
        updateMessage = 'Unknown firmware status';
    }
    
    res.json({
      firmwareStatus: deviceInfo.fwStatus,
      updateRequired,
      updateMessage,
      currentVersion: deviceInfo.fwVersion
    });
  } catch (err) {
    console.error('Error checking firmware:', err);
    next(err);
  }
}

/**
 * Set device slide settings (min/max position)
 */
async function setSlideSettings(req, res, next) {
  try {
    const { userId, min, max, fixed } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (min === undefined && max === undefined) {
      return res.status(400).json({ error: 'min and/or max values required' });
    }
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Set slide settings
    const settings = {};
    if (min !== undefined) settings.min = min;
    if (max !== undefined) settings.max = max;
    if (fixed !== undefined) settings.fixed = fixed;
    
    const result = await handy.setSlideSettings(connectionKey, settings);
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting slide settings:', err);
    next(err);
  }
}

/**
 * Set device HAMP mode settings (velocity)
 */
async function setVelocity(req, res, next) {
  try {
    const { userId, velocity } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (velocity === undefined) return res.status(400).json({ error: 'velocity required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // First ensure we're in HAMP mode
    await handy.setMode(connectionKey, 0);
    
    // Set velocity
    const result = await handy.setHampVelocity(connectionKey, velocity);
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting velocity:', err);
    next(err);
  }
}

/**
 * Start device movement
 */
async function startDevice(req, res, next) {
  try {
    const { userId, velocity } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // First ensure we're in HAMP mode
    await handy.setMode(connectionKey, 0);
    
    // Set velocity if provided
    if (velocity !== undefined) {
      await handy.setHampVelocity(connectionKey, velocity);
    }
    
    // Start movement
    const result = await handy.startHamp(connectionKey);
    
    res.json({ result });
  } catch (err) {
    console.error('Error starting device:', err);
    next(err);
  }
}

/**
 * Stop device movement
 */
async function stopDevice(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Stop movement
    const result = await handy.stopHamp(connectionKey);
    
    res.json({ result });
  } catch (err) {
    console.error('Error stopping device:', err);
    next(err);
  }
}

module.exports = { 
  pairDevice, 
  getStatus, 
  controlDevice,
  checkFirmware,
  setSlideSettings,
  setVelocity,
  startDevice,
  stopDevice
}; 