const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { requireAuth } = require('../middleware/auth');

// GET /catways/:id/reservations - Liste réservations d'un catway
router.get('/:id/reservations', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/catways');
    const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber }).sort({ startDate: 1 });
    res.render('reservations/index', { catway, reservations, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// GET /catways/:id/reservations/new
router.get('/:id/reservations/new', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/catways');
    res.render('reservations/new', { catway, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// GET /catway/:id/reservations/:idReservation - Détail
router.get('/:id/reservations/:idReservation', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!catway || !reservation) return res.redirect('/catways');
    res.render('reservations/show', { catway, reservation, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// POST /catways/:id/reservations - Créer
router.post('/:id/reservations', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/catways');
    const { clientName, boatName, startDate, endDate } = req.body;
    await Reservation.create({ catwayNumber: catway.catwayNumber, clientName, boatName, startDate, endDate });
    res.redirect(`/catways/${req.params.id}`);
  } catch (err) {
    const catway = await Catway.findById(req.params.id);
    res.render('reservations/new', { catway, error: err.message });
  }
});

// GET /catways/:id/reservations/:idReservation/edit
router.get('/:id/reservations/:idReservation/edit', requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!catway || !reservation) return res.redirect('/catways');
    res.render('reservations/edit', { catway, reservation, error: null });
  } catch (err) {
    res.redirect('/catways');
  }
});

// PUT /catways/:id/reservations - Modifier
router.put('/:id/reservations/:idReservation', requireAuth, async (req, res) => {
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    await Reservation.findByIdAndUpdate(
      req.params.idReservation,
      { clientName, boatName, startDate, endDate },
      { runValidators: true, new: true }
    );
    res.redirect(`/catways/${req.params.id}/reservations/${req.params.idReservation}`);
  } catch (err) {
    const catway = await Catway.findById(req.params.id);
    const reservation = await Reservation.findById(req.params.idReservation);
    res.render('reservations/edit', { catway, reservation, error: err.message });
  }
});

// DELETE /catway/:id/reservations/:idReservation - Supprimer
router.delete('/:id/reservations/:idReservation', requireAuth, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.idReservation);
    res.redirect(`/catways/${req.params.id}`);
  } catch (err) {
    res.redirect(`/catways/${req.params.id}`);
  }
});

module.exports = router;
