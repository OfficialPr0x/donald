const express = require('express');
const { savePreferences, getPreferences } = require('../controllers/preferencesController');
const router = express.Router();

router.post('/save', savePreferences);
router.get('/get', getPreferences);

module.exports = router; 