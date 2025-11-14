const SUPABASE_URL = process.env.SUPABASE_URL;

function isAbsoluteUrl(p) {
  return typeof p === 'string' && /^https?:\/\//i.test(p);
}

function publicSongUrl(path) {
  if (!path) return '';
  if (isAbsoluteUrl(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/songs/${path}`;
}

function publicBackgroundUrl(path) {
  if (!path) return '';
  if (isAbsoluteUrl(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/backgrounds/${path}`;
}

module.exports = {
  publicSongUrl,
  publicBackgroundUrl,
};