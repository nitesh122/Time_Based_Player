require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;

function publicSongUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/songs/${path}`;
}

function publicBackgroundUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/backgrounds/${path}`;
}

module.exports = {
  publicSongUrl,
  publicBackgroundUrl,
};