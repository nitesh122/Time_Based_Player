const { supabase } = require('../db');
const { publicBackgroundUrl } = require('../storage');

// Get all time blocks
async function getTimeBlocks(req, res) {
  try {
    const { data, error } = await supabase
      .from('time_blocks')
      .select('*')
      .order('block_id');
    if (error) throw error;
    const blocks = (data || []).map((b) => ({
      ...b,
      background_url: publicBackgroundUrl(b.background_path || b.background_image),
      // Maintain backward compatibility: frontend expects background_image
      background_image: publicBackgroundUrl(b.background_path || b.background_image),
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
    const { data: blocks, error } = await supabase
      .from('time_blocks')
      .select('*');
    if (error) throw error;
    if (!blocks || !blocks.length) return res.status(404).json({ error: 'No time blocks found' });

    // Compute current IST time (HH:MM)
    const now = new Date();
    const istOffsetMinutes = 5.5 * 60; // IST is UTC+5:30
    const utcMinutes = now.getUTCMinutes() + now.getUTCHours() * 60;
    const istMinutes = (utcMinutes + istOffsetMinutes) % (24 * 60);
    const pad = (n) => String(n).padStart(2, '0');
    const istHH = Math.floor(istMinutes / 60);
    const istMM = istMinutes % 60;
    const currentTimeStr = `${pad(istHH)}:${pad(istMM)}`;

    const toMinutes = (t) => {
      const [h, m] = String(t).split(':').map(Number);
      return h * 60 + m;
    };
    const cur = toMinutes(currentTimeStr);

    const active = blocks.find((tb) => {
      const start = toMinutes(tb.start_time);
      const end = toMinutes(tb.end_time);
      if (end > start) {
        return cur >= start && cur <= end;
      }
      // Overnight block (wraps past midnight)
      return cur >= start || cur <= end;
    });

    if (!active) return res.status(404).json({ error: 'No active block' });

    const block = {
      ...active,
      background_url: publicBackgroundUrl(active.background_path || active.background_image),
      background_image: publicBackgroundUrl(active.background_path || active.background_image),
    };
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
