/*
  Seed script for Supabase (PostgreSQL)
  - Inserts baseline data for time_blocks, playlists, songs
  - Requires tables to already exist. If not, run schema.sql in Supabase SQL Editor.
*/
require('dotenv').config();
const supabase = require('../src/config/supabase');

async function tableExists(name) {
  const { data, error } = await supabase
    .from(name)
    .select('*')
    .limit(1);
  if (error) return false; // likely missing table or RLS error
  return Array.isArray(data);
}

async function upsertPlaylists() {
  const playlists = [
    { playlist_id: 101, name: 'Midnight Chill', description: 'Relaxing late night' },
    { playlist_id: 102, name: 'Sunrise Calm', description: 'Peaceful morning' },
    { playlist_id: 103, name: 'Morning Energy', description: 'Upbeat morning' },
    { playlist_id: 104, name: 'Afternoon Focus', description: 'Productive midday vibes' },
    { playlist_id: 105, name: 'Evening Relax', description: 'Wind down after work' },
    { playlist_id: 106, name: 'Night Vibes', description: 'Late evening atmosphere' },
  ];
  const { error } = await supabase.from('playlists').upsert(playlists, { onConflict: 'playlist_id' });
  if (error) throw error;
}

async function upsertTimeBlocks() {
  const blocks = [
    { block_id: 1, start_time: '00:00', end_time: '03:59', playlist_id: 101, background_path: 'night.jpg' },
    { block_id: 2, start_time: '04:00', end_time: '07:59', playlist_id: 102, background_path: 'sunrise.jpg' },
    { block_id: 3, start_time: '08:00', end_time: '11:59', playlist_id: 103, background_path: 'morning.jpg' },
    { block_id: 4, start_time: '12:00', end_time: '15:59', playlist_id: 104, background_path: 'afternoon.jpg' },
    { block_id: 5, start_time: '16:00', end_time: '19:59', playlist_id: 105, background_path: 'evening.jpg' },
    { block_id: 6, start_time: '20:00', end_time: '23:59', playlist_id: 106, background_path: 'night-vibes.jpg' },
  ];
  const { error } = await supabase.from('time_blocks').upsert(blocks, { onConflict: 'block_id' });
  if (error) throw error;
}

async function upsertSongs() {
  const songs = [
    { song_id: 1, title: 'Moonlight', url: '', file_path: 'moonlight.mp3', artist: 'Artist A', playlist_id: 101 },
    { song_id: 2, title: 'Early Bird', url: '', file_path: 'early-bird.mp3', artist: 'Artist B', playlist_id: 102 },
  ];
  const { error } = await supabase.from('songs').upsert(songs, { onConflict: 'song_id' });
  if (error) throw error;
}

async function main() {
  let missing = [];
  for (const t of ['playlists', 'time_blocks', 'songs']) {
    const exists = await tableExists(t);
    if (!exists) missing.push(t);
  }
  if (missing.length) {
    console.log('One or more tables are missing:', missing.join(', '));
    console.log('Please run backend/scripts/schema.sql in Supabase SQL Editor, then rerun: npm run seed');
    process.exit(1);
  }

  await upsertPlaylists();
  await upsertTimeBlocks();
  await upsertSongs();

  console.log('✅ Seed complete');
}

main().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
