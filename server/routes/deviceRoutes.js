const express = require('express');
const { 
  pairDevice, 
  getStatus, 
  controlDevice, 
  checkFirmware,
  setSlideSettings,
  setVelocity,
  startDevice,
  stopDevice
} = require('../controllers/deviceController');
const router = express.Router();

// Device pairing and status
router.post('/pair', pairDevice);
router.get('/status', getStatus);
router.get('/firmware', checkFirmware);

// Device control endpoints
router.post('/control', controlDevice);
router.post('/slide', setSlideSettings);
router.post('/velocity', setVelocity);
router.post('/start', startDevice);
router.post('/stop', stopDevice);

module.exports = router; 