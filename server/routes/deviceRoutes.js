const express = require('express');
const { pairDevice, getStatus, controlDevice } = require('../controllers/deviceController');
const router = express.Router();

router.post('/pair', pairDevice);
router.get('/status', getStatus);
router.post('/control', controlDevice);

module.exports = router; 