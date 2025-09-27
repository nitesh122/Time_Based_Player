import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ playlist, isPlaying, onPlayPause, onNext, onPrevious }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  const currentTrack = playlist?.songs?.[currentTrackIndex];

  // Handle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          // Handle audio play error (e.g., autoplay blocked)
        });
      }
      onPlayPause(!isPlaying);
    }
  };

  // Handle next track
  const handleNext = () => {
    if (playlist?.songs?.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.songs.length;
      setCurrentTrackIndex(nextIndex);
      onNext(nextIndex);
    }
  };

  // Handle previous track
  const handlePrevious = () => {
    if (playlist?.songs?.length > 0) {
      const prevIndex = currentTrackIndex === 0 
        ? playlist.songs.length - 1 
        : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      onPrevious(prevIndex);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle track end
  const handleTrackEnd = () => {
    handleNext();
  };

  // Handle seek
  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-play when track changes
  useEffect(() => {
    if (currentTrack && isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrackIndex, currentTrack, isPlaying]);

  // Reset track when playlist changes
  useEffect(() => {
    setCurrentTrackIndex(0);
    setCurrentTime(0);
  }, [playlist]);

  if (!playlist || !playlist.songs || playlist.songs.length === 0) {
    return (
      <div className="music-player">
        <div className="no-playlist">
          <p>No playlist available for this time block</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
        preload="metadata"
      />
      
      <div className="track-info">
        <h3 className="track-title">{currentTrack?.title || 'No track'}</h3>
        <p className="track-artist">{currentTrack?.artist || 'Unknown artist'}</p>
        <p className="playlist-name">{playlist.name}</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar" onClick={handleSeek}>
          <div 
            className="progress-fill"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          ></div>
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={handlePrevious} disabled={!playlist.songs.length}>
          ⏮
        </button>
        <button className="control-btn play-pause" onClick={handlePlayPause}>
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button className="control-btn" onClick={handleNext} disabled={!playlist.songs.length}>
          ⏭
        </button>
      </div>

      <div className="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>

      <div className="track-counter">
        Track {currentTrackIndex + 1} of {playlist.songs.length}
      </div>
    </div>
  );
};

export default MusicPlayer;
