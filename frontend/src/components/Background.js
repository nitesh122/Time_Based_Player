import React, { useState, useEffect } from 'react';
import { getBlockName, getBlockDescription } from '../utils/timeUtils';
import './Background.css';

const Background = ({ timeBlock, backgroundImage }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Background images for each time block
  const backgroundImages = {
    1: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Night
    2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Sunrise
    3: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Morning
    4: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Afternoon
    5: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Evening
    6: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Night
  };

  // Color schemes for each time block
  const colorSchemes = {
    1: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' }, // Night
    2: { primary: '#e67e22', secondary: '#f39c12', accent: '#f1c40f' }, // Sunrise
    3: { primary: '#27ae60', secondary: '#2ecc71', accent: '#1abc9c' }, // Morning
    4: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' }, // Afternoon
    5: { primary: '#8e44ad', secondary: '#9b59b6', accent: '#e67e22' }, // Evening
    6: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' }  // Night
  };

  const currentScheme = colorSchemes[timeBlock] || colorSchemes[1];
  const currentImage = backgroundImage || backgroundImages[timeBlock] || backgroundImages[1];

  useEffect(() => {
    setIsLoaded(false);
  }, [timeBlock, backgroundImage]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="background-container">
      {/* Background Image */}
      <div 
        className={`background-image ${isLoaded ? 'loaded' : ''}`}
        style={{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay with time block colors */}
      <div 
        className="background-overlay"
        style={{
          background: `linear-gradient(135deg, ${currentScheme.primary}80, ${currentScheme.secondary}80)`
        }}
      />
      
      {/* Hidden image for preloading */}
      <img
        src={currentImage}
        alt="Background"
        onLoad={handleImageLoad}
        style={{ display: 'none' }}
      />
      
      {/* Time block info overlay */}
      <div className="time-block-info">
        <h2 className="block-name">{getBlockName(timeBlock)}</h2>
        <p className="block-description">{getBlockDescription(timeBlock)}</p>
      </div>
    </div>
  );
};

export default Background;
