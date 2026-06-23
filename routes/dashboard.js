const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const now = new Date();
    const activeReservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ endDate: 1 });
    res.render('dashboard', { activeReservations, now });
  } catch (err) {
    res.render('dashboard', { activeReservations: [], now: new Date() });
  }
});

module.exports = router;
