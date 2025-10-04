const db = require('../db');
const { publicBackgroundUrl } = require('../storage');

// Get all time blocks
async function getTimeBlocks(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM time_blocks ORDER BY block_id');
    const blocks = rows.map((b) => ({
      ...b,
      background_url: publicBackgroundUrl(b.background_path),
    }));
    res.json(blocks);
  } catch (err) {
    console.error('Error fetching time blocks:', err);
    res.status(500).json({ error: 'Failed to fetch time blocks' });
  }
}

// Get current block based on server time in IST
async function getCurrentTimeBlock(req, res) {
  try {
    const { rows } = await db.query(
      `WITH now_ist AS (
         SELECT (current_timestamp AT TIME ZONE 'Asia/Kolkata')::time AS t
       )
       SELECT *
       FROM time_blocks tb, now_ist n
       WHERE
         (tb.end_time > tb.start_time AND n.t BETWEEN tb.start_time AND tb.end_time)
         OR
         (tb.end_time < tb.start_time AND (n.t >= tb.start_time OR n.t <= tb.end_time))
       LIMIT 1`
    );

    if (!rows.length) return res.status(404).json({ error: 'No active block' });

    const block = rows[0];
    block.background_url = publicBackgroundUrl(block.background_path);

    res.json(block);
  } catch (err) {
    console.error('Error fetching current time block:', err);
    res.status(500).json({ error: 'Failed to fetch current block' });
  }
}

module.exports = {
  getTimeBlocks,
  getCurrentTimeBlock,
};
