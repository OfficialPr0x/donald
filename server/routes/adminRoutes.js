const express = require('express');
const { getUsers, getSessions, updateMappings, updatePersonas } = require('../controllers/adminController');
const router = express.Router();

router.get('/users', getUsers);
router.get('/sessions', getSessions);
router.post('/mappings', updateMappings);
router.post('/personas', updatePersonas);

module.exports = router; 