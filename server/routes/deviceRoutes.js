const express = require('express');
const { 
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
} = require('../controllers/deviceController');

const router = express.Router();

// Device pairing and status
router.post('/pair', pairDevice);
router.get('/status', getStatus);
router.get('/firmware', checkFirmware);
router.post('/mode', setDeviceMode);

// Time synchronization
router.get('/servertime', getServerTime);
router.get('/offset', calculateOffset);

// Basic device control
router.post('/control', controlDevice);
router.post('/slide', setSlideSettings);
router.post('/velocity', setVelocity);
router.post('/start', startDevice);
router.post('/stop', stopDevice);

// HSSP (Script playback)
router.post('/hssp/setup', setupHssp);
router.post('/hssp/play', playScript);
router.post('/hssp/stop', stopScript);
router.post('/hssp/seek', seekScript);
router.get('/hssp/state', getScriptState);
router.post('/hssp/loop', setScriptLoop);

// HDSP (Direct control)
router.post('/hdsp/position', sendDirectPosition);

// HSTP (Timing protocol)
router.get('/hstp', getHstpStatus);
router.post('/hstp/sync', startHstpSync);
router.post('/hstp/time', syncTime);
router.post('/hstp/offset', setHstpOffset);

// Firmware
router.get('/ota/latest', getLatestFirmware);

module.exports = router; 