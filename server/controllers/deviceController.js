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

/**
 * Get server time for sync
 */
async function getServerTime(req, res, next) {
  try {
    const result = await handy.getServerTime();
    res.json(result);
  } catch (err) {
    console.error('Error getting server time:', err);
    next(err);
  }
}

/**
 * Calculate client-server offset
 */
async function calculateOffset(req, res, next) {
  try {
    const { sampleSize } = req.query;
    const samples = sampleSize ? parseInt(sampleSize) : 30;
    
    const offset = await handy.calculateClientServerOffset(samples);
    res.json({ offset });
  } catch (err) {
    console.error('Error calculating offset:', err);
    next(err);
  }
}

/**
 * Switch device mode
 */
async function setDeviceMode(req, res, next) {
  try {
    const { userId, mode } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (mode === undefined) return res.status(400).json({ error: 'mode required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Set mode
    const result = await handy.setMode(connectionKey, mode);
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting device mode:', err);
    next(err);
  }
}

// HSSP (Handy Synced Stream Protocol) endpoints

/**
 * Set up HSSP for script playback
 */
async function setupHssp(req, res, next) {
  try {
    const { userId, timeout } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Ensure we're in HSSP mode
    await handy.setMode(connectionKey, 2);
    
    // Set up HSSP
    const result = await handy.setHsspSetup(connectionKey, { 
      timeout: timeout || 5000 
    });
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting up HSSP:', err);
    next(err);
  }
}

/**
 * Play script with HSSP
 */
async function playScript(req, res, next) {
  try {
    const { userId, url, startTime, loop, csOffset } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!url) return res.status(400).json({ error: 'script url required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Use command helper to handle mode switching and setup
    const result = await handy.sendCommand(connectionKey, 'play_script', {
      url,
      startTime: startTime || 0,
      loop: loop || false,
      csOffset,
      timeout: 5000
    });
    
    res.json({ result });
  } catch (err) {
    console.error('Error playing script:', err);
    next(err);
  }
}

/**
 * Stop script playback
 */
async function stopScript(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Stop HSSP playback
    const result = await handy.stopHssp(connectionKey);
    
    res.json({ result });
  } catch (err) {
    console.error('Error stopping script:', err);
    next(err);
  }
}

/**
 * Seek to position in script
 */
async function seekScript(req, res, next) {
  try {
    const { userId, time, csOffset } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (time === undefined) return res.status(400).json({ error: 'time required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Use command helper to handle estimating server time
    const result = await handy.sendCommand(connectionKey, 'seek_script', {
      time,
      csOffset
    });
    
    res.json({ result });
  } catch (err) {
    console.error('Error seeking script:', err);
    next(err);
  }
}

/**
 * Get script playback state
 */
async function getScriptState(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Get HSSP state
    const result = await handy.getHsspState(connectionKey);
    
    res.json(result);
  } catch (err) {
    console.error('Error getting script state:', err);
    next(err);
  }
}

/**
 * Set script loop state
 */
async function setScriptLoop(req, res, next) {
  try {
    const { userId, loop } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (loop === undefined) return res.status(400).json({ error: 'loop required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Set HSSP loop
    const result = await handy.setHsspLoop(connectionKey, { loop });
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting script loop:', err);
    next(err);
  }
}

// HDSP (Handy Direct Streaming Protocol) endpoints

/**
 * Send direct position command
 */
async function sendDirectPosition(req, res, next) {
  try {
    const { userId, position } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (position === undefined) return res.status(400).json({ error: 'position required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Use command helper to handle mode switching
    const result = await handy.sendCommand(connectionKey, 'direct_position', { position });
    
    res.json({ result });
  } catch (err) {
    console.error('Error sending direct position:', err);
    next(err);
  }
}

// HSTP (Handy Simple Timing Protocol) endpoints

/**
 * Get HSTP status
 */
async function getHstpStatus(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Get HSTP status
    const result = await handy.getHstpStatus(connectionKey);
    
    res.json(result);
  } catch (err) {
    console.error('Error getting HSTP status:', err);
    next(err);
  }
}

/**
 * Sync device time
 */
async function syncTime(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Sync time
    const result = await handy.syncHstpTime(connectionKey);
    
    res.json({ result });
  } catch (err) {
    console.error('Error syncing time:', err);
    next(err);
  }
}

/**
 * Set HSTP offset
 */
async function setHstpOffset(req, res, next) {
  try {
    const { userId, offset } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (offset === undefined) return res.status(400).json({ error: 'offset required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Set HSTP offset
    const result = await handy.setHstpOffset(connectionKey, { offset });
    
    res.json({ result });
  } catch (err) {
    console.error('Error setting HSTP offset:', err);
    next(err);
  }
}

/**
 * Start HSTP sync process
 */
async function startHstpSync(req, res, next) {
  try {
    const { userId, timeout } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    // Get user's connection key
    const { data, error } = await supabase.from('profiles').select('handy_key').eq('id', userId).single();
    if (error || !data?.handy_key) return res.status(404).json({ error: 'Device not paired' });
    
    const connectionKey = data.handy_key;
    
    // Start HSTP sync
    const result = await handy.startHstpSync(connectionKey, {
      timeout: timeout || 30000
    });
    
    res.json({ result });
  } catch (err) {
    console.error('Error starting HSTP sync:', err);
    next(err);
  }
}

/**
 * Get latest firmware info
 */
async function getLatestFirmware(req, res, next) {
  try {
    const { model, branch } = req.query;
    if (!model) return res.status(400).json({ error: 'model required' });
    if (!branch) return res.status(400).json({ error: 'branch required' });
    
    // Get latest firmware info
    const result = await handy.getLatestFirmware(model, branch);
    
    res.json(result);
  } catch (err) {
    console.error('Error getting latest firmware:', err);
    next(err);
  }
}

module.exports = { 
  // Basic device control
  pairDevice, 
  getStatus, 
  controlDevice,
  checkFirmware,
  setSlideSettings,
  setVelocity,
  startDevice,
  stopDevice,
  setDeviceMode,
  
  // Time sync
  getServerTime,
  calculateOffset,
  
  // HSSP (script playback)
  setupHssp,
  playScript,
  stopScript,
  seekScript,
  getScriptState,
  setScriptLoop,
  
  // HDSP (direct control)
  sendDirectPosition,
  
  // HSTP (timing protocol)
  getHstpStatus,
  syncTime,
  setHstpOffset,
  startHstpSync,
  
  // Firmware
  getLatestFirmware
}; 