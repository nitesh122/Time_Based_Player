import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('backgrounds');
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [backgroundForm, setBackgroundForm] = useState({
    timeBlockId: '',
    file: null
  });
  const [musicForm, setMusicForm] = useState({
    title: '',
    artist: '',
    playlistId: '',
    file: null
  });

  useEffect(() => {
    if (isOpen) {
      fetchTimeBlocks();
      fetchPlaylists();
    }
  }, [isOpen]);

  const fetchTimeBlocks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/time-blocks');
      const data = await response.json();
      setTimeBlocks(data);
    } catch (error) {
      console.error('Error fetching time blocks:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/playlists');
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleBackgroundUpload = async (e) => {
    e.preventDefault();
    if (!backgroundForm.file || !backgroundForm.timeBlockId) {
      setMessage('Please select a file and time block');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('background', backgroundForm.file);
    formData.append('timeBlockId', backgroundForm.timeBlockId);

    try {
      const response = await fetch('http://localhost:3001/api/upload/background', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Background uploaded successfully!');
        setBackgroundForm({ timeBlockId: '', file: null });
      } else {
        setMessage('Upload failed: ' + result.error);
      }
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMusicUpload = async (e) => {
    e.preventDefault();
    if (!musicForm.file || !musicForm.title || !musicForm.artist || !musicForm.playlistId) {
      setMessage('Please fill all fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('music', musicForm.file);
    formData.append('title', musicForm.title);
    formData.append('artist', musicForm.artist);
    formData.append('playlistId', musicForm.playlistId);

    try {
      const response = await fetch('http://localhost:3001/api/upload/music', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Music uploaded successfully!');
        setMusicForm({ title: '', artist: '', playlistId: '', file: null });
      } else {
        setMessage('Upload failed: ' + result.error);
      }
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'backgrounds' ? 'active' : ''}`}
            onClick={() => setActiveTab('backgrounds')}
          >
            Backgrounds
          </button>
          <button 
            className={`tab ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            Music
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {activeTab === 'backgrounds' && (
          <div className="upload-section">
            <h3>Upload Background Image</h3>
            <form onSubmit={handleBackgroundUpload}>
              <div className="form-group">
                <label>Select Time Block:</label>
                <select 
                  value={backgroundForm.timeBlockId}
                  onChange={(e) => setBackgroundForm({...backgroundForm, timeBlockId: e.target.value})}
                  required
                >
                  <option value="">Choose time block...</option>
                  {timeBlocks.map(block => (
                    <option key={block.block_id} value={block.block_id}>
                      {block.playlist_name} ({block.start_time} - {block.end_time})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select Image File:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBackgroundForm({...backgroundForm, file: e.target.files[0]})}
                  required
                />
              </div>
              
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Background'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="upload-section">
            <h3>Upload Music File</h3>
            <form onSubmit={handleMusicUpload}>
              <div className="form-group">
                <label>Song Title:</label>
                <input
                  type="text"
                  value={musicForm.title}
                  onChange={(e) => setMusicForm({...musicForm, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Artist:</label>
                <input
                  type="text"
                  value={musicForm.artist}
                  onChange={(e) => setMusicForm({...musicForm, artist: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Select Playlist:</label>
                <select 
                  value={musicForm.playlistId}
                  onChange={(e) => setMusicForm({...musicForm, playlistId: e.target.value})}
                  required
                >
                  <option value="">Choose playlist...</option>
                  {playlists.map(playlist => (
                    <option key={playlist.playlist_id} value={playlist.playlist_id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select Music File:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setMusicForm({...musicForm, file: e.target.files[0]})}
                  required
                />
              </div>
              
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Music'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
