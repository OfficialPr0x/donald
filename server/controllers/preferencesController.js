const { supabase } = require('../services/supabaseService');

async function savePreferences(req, res, next) {
  try {
    const { userId, ageGroup, sex, demeanor, voiceId } = req.body;
    if (!userId || !ageGroup || !sex || !demeanor || !voiceId) {
      return res.status(400).json({ error: 'All fields required' });
    }
    await supabase.from('profiles').update({ age_group: ageGroup, sex, demeanor, voice_id: voiceId }).eq('id', userId);
    res.json({ message: 'Preferences saved' });
  } catch (err) {
    next(err);
  }
}

async function getPreferences(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase.from('profiles').select('age_group, sex, demeanor, voice_id').eq('id', userId).single();
    if (error) return res.status(404).json({ error: 'Preferences not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { savePreferences, getPreferences }; 