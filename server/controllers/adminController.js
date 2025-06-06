const { supabase } = require('../services/supabaseService');

async function getUsers(req, res, next) {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getSessions(req, res, next) {
  try {
    // Example: fetch device sessions, implement as needed
    const { data, error } = await supabase.from('sessions').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function updateMappings(req, res, next) {
  try {
    const { mappings } = req.body;
    if (!mappings) return res.status(400).json({ error: 'Mappings required' });
    // Save mappings to DB or config
    await supabase.from('mappings').upsert(mappings);
    res.json({ message: 'Mappings updated' });
  } catch (err) {
    next(err);
  }
}

async function updatePersonas(req, res, next) {
  try {
    const { personas } = req.body;
    if (!personas) return res.status(400).json({ error: 'Personas required' });
    // Save personas to DB or config
    await supabase.from('personas').upsert(personas);
    res.json({ message: 'Personas updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, getSessions, updateMappings, updatePersonas }; 