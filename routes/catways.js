const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const { requireAuth } = require('../middleware/auth');

// GET /catways - Liste tous les catways
router.get('/', requireAuth, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways/index', { catways, error: null, success: null });
  } catch (err) {
    res.render('catways/index', { catways: [], error: 'Erreur lors du chargement.', success: null });
  }
});

// GET /catways/new - Formulaire création
router.get('/new', requireAuth, (req, res) => {
  res.render('catways/new', { error: null });
});

// GET /catways/:id - Détail d'un catway
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/catways');
    const Reservation = require('../models/Reservation');
    const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber }).sort({ startDate: -1 });
    res.render('catways/show', { catway, reservations, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// POST /catways - Créer un catway
router.post('/', requireAuth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    await Catway.create({ catwayNumber, catwayType, catwayState });
    res.redirect('/catways');
  } catch (err) {
    res.render('catways/new', { error: err.message || 'Erreur lors de la création.' });
  }
});

// GET /catways/:id/edit - Formulaire modification
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/catways');
    res.render('catways/edit', { catway, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// PUT /catways/:id - Modifier l'état d'un catway
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { catwayState } = req.body;
    await Catway.findByIdAndUpdate(req.params.id, { catwayState }, { runValidators: true });
    res.redirect(`/catways/${req.params.id}`);
  } catch (err) {
    const catway = await Catway.findById(req.params.id);
    res.render('catways/edit', { catway, error: err.message });
  }
});

// DELETE /catways/:id - Supprimer un catway
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.redirect('/catways');
  } catch (err) {
    res.redirect('/catways');
  }
});

module.exports = router;
