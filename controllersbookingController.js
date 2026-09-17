const db = require('../config/db');

// User: Daftar ke Sesi Olahraga
exports.createBooking = async (req, res) => {
  const { event_id, user_name, user_phone } = req.body;
  try {
    // Cek Sisa Kuota
    const checkQuota = await db.query(
      `SELECT e.max_quota, COUNT(b.id) as filled 
       FROM events e 
       LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'PAID'
       WHERE e.id = $1 GROUP BY e.id`,
      [event_id]
    );

    if (checkQuota.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
    }

    const { max_quota, filled } = checkQuota.rows[0];
    if (parseInt(filled) >= parseInt(max_quota)) {
      return res.status(400).json({ success: false, message: 'Kuota sudah penuh!' });
    }

    // Simpan Pendaftaran
    const result = await db.query(
      `INSERT INTO bookings (event_id, user_name, user_phone) 
       VALUES ($1, $2, $3) RETURNING *`,
      [event_id, user_name, user_phone]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: Lihat Siapa Saja yang Ikut di Sesi Tertentu
exports.getEventParticipants = async (req, res) => {
  const { event_id } = req.params;
  try {
    const result = await db.query(
      `SELECT id, user_name, user_phone, status, created_at 
       FROM bookings 
       WHERE event_id = $1 
       ORDER BY created_at ASC`,
      [event_id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};