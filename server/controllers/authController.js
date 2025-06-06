const { supabase } = require('../services/supabaseService');

async function register(req, res, next) {
  try {
    const { email, password, ageConfirmed } = req.body;
    if (!email || !password || !ageConfirmed) {
      return res.status(400).json({ error: 'All fields required and must confirm age 18+' });
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    // Optionally: create user profile row
    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    res.status(200).json({ session: data.session, user: data.user });
  } catch (err) {
    next(err);
  }
}

async function session(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });
    res.status(200).json({ user: data.user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, session }; 