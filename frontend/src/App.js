import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import MusicPlayer from './components/MusicPlayer';
import Background from './components/Background';
import ConnectionStatus from './components/ConnectionStatus';
import AdminPanel from './components/AdminPanel';
import { timeBlockAPI, playlistAPI } from './services/api';
import { getCurrentTimeBlock } from './utils/timeUtils';
import './App.css';

function App() {
  const [currentTimeBlock, setCurrentTimeBlock] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch current time block and playlist
  const fetchCurrentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current time block from API
      const timeBlockResponse = await timeBlockAPI.getCurrent();
      const timeBlock = timeBlockResponse.data;

      if (timeBlock) {
        setCurrentTimeBlock(timeBlock);

        // Get playlist for current time block
        const playlistResponse = await playlistAPI.getById(timeBlock.playlist_id);
        const playlist = playlistResponse.data;

        if (playlist) {
          setCurrentPlaylist(playlist);
        } else {
          throw new Error('No playlist found for current time block');
        }
      } else {
        throw new Error('No time block found for current time');
      }
    } catch (err) {
      console.error('Error fetching current data:', err);
      setError(err.message);
      
      // Fallback to client-side time detection
      const fallbackBlock = getCurrentTimeBlock();
      setCurrentTimeBlock({
        block_id: fallbackBlock,
        start_time: '00:00',
        end_time: '23:59',
        playlist_id: fallbackBlock,
        background_image: 'default.jpg'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle time block change
  const handleTimeBlockChange = async (newBlockId) => {
    try {
      // Get time block by ID
      const timeBlockResponse = await timeBlockAPI.getById(newBlockId);
      const timeBlock = timeBlockResponse.data;

      if (timeBlock) {
        setCurrentTimeBlock(timeBlock);

        // Get playlist for new time block
        const playlistResponse = await playlistAPI.getById(timeBlock.playlist_id);
        const playlist = playlistResponse.data;

        if (playlist) {
          setCurrentPlaylist(playlist);
          // Auto-play new playlist
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Error handling time block change:', err);
    }
  };

  // Handle play/pause
  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
  };

  // Handle track change
  const handleTrackChange = (newIndex) => {
    // This could be used for analytics or other track change logic
    console.log('Track changed to index:', newIndex);
  };

  // Initialize app
  useEffect(() => {
    fetchCurrentData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your musical journey...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchCurrentData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Background 
        timeBlock={currentTimeBlock?.block_id} 
        backgroundImage={currentTimeBlock?.background_image}
      />
      
      <ConnectionStatus />
      
      {/* Admin Button */}
      <button 
        className="admin-btn"
        onClick={() => setShowAdmin(true)}
        title="Open Admin Panel"
      >
        ⚙️
      </button>
      
      <div className="app-content">
        <Clock 
          onTimeBlockChange={handleTimeBlockChange}
          currentTimeBlock={currentTimeBlock?.block_id}
        />
        
        <MusicPlayer
          playlist={currentPlaylist}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleTrackChange}
          onPrevious={handleTrackChange}
        />
      </div>
      
      <AdminPanel 
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />
    </div>
  );
}

export default App;
