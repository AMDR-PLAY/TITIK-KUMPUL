const db = require('../config/db');

// Admin: Buat Jadwal Olahraga Baru
exports.createEvent = async (req, res) => {
  const { title, date_time, location, price, max_quota } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO events (title, date_time, location, price, max_quota) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, date_time, location, price, max_quota]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// User: Lihat Semua Jadwal Olahraga
exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, 
             COUNT(b.id) FILTER (WHERE b.status = 'PAID') AS current_participants
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id
      ORDER BY e.date_time ASC
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};