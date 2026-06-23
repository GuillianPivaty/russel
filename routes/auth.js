const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET / - Page d'accueil
router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('index', { error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('index', { error: 'Veuillez remplir tous les champs.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('index', { error: 'Email ou mot de passe incorrect.' });
    }
    req.session.user = { id: user._id, username: user.username, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    res.render('index', { error: 'Erreur lors de la connexion.' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
