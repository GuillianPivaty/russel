const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// GET /users/ - Liste
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.render('users/index', { users, error: null, success: null });
  } catch (err) {
    res.render('users/index', { users: [], error: 'Erreur chargement.', success: null });
  }
});

// GET /users/new
router.get('/new', requireAuth, (req, res) => {
  res.render('users/new', { error: null });
});

// GET /users/:email - Détail
router.get('/:email', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.redirect('/users');
    res.render('users/show', { user, error: null });
  } catch (err) {
    res.redirect('/users');
  }
});

// POST /users/ - Créer
router.post('/', requireAuth, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.redirect('/users');
  } catch (err) {
    res.render('users/new', { error: err.message || 'Erreur création.' });
  }
});

// GET /users/:email/edit
router.get('/:email/edit', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.redirect('/users');
    res.render('users/edit', { user, error: null });
  } catch (err) {
    res.redirect('/users');
  }
});

// PUT /users/:email - Modifier
router.put('/:email', requireAuth, async (req, res) => {
  try {
    const { username, email: newEmail, password } = req.body;
    const updateData = { username, email: newEmail };
    if (password && password.length >= 6) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 12);
    }
    await User.findOneAndUpdate({ email: req.params.email }, updateData, { runValidators: true });
    res.redirect(`/users/${newEmail || req.params.email}`);
  } catch (err) {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    res.render('users/edit', { user, error: err.message });
  }
});

// DELETE /users/:email
router.delete('/:email', requireAuth, async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.redirect('/users');
  } catch (err) {
    res.redirect('/users');
  }
});

module.exports = router;
