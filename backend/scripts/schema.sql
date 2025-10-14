-- Supabase/PostgreSQL schema for Time-Based Music Player
-- Run this in the Supabase SQL Editor

create table if not exists public.playlists (
  playlist_id integer primary key,
  name text not null,
  description text
);

create table if not exists public.time_blocks (
  block_id integer primary key,
  start_time time not null,
  end_time time not null,
  playlist_id integer not null references public.playlists(playlist_id) on delete cascade,
  background_path text
);

create table if not exists public.songs (
  song_id integer primary key,
  title text not null,
  file_path text not null,
  artist text,
  playlist_id integer not null references public.playlists(playlist_id) on delete cascade
);

-- Recommended storage buckets (create via Supabase Storage UI):
--  - backgrounds
--  - songs

-- Optional: make public buckets and set RLS policies appropriately.
