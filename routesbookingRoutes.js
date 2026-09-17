const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/event/:event_id', bookingController.getEventParticipants);

module.exports = router;