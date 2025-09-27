import React, { useState, useEffect } from 'react';
import { getCurrentTime, getCurrentTimeBlock, getTimeUntilNextBlock, formatTimeRemaining } from '../utils/timeUtils';
import './Clock.css';

const Clock = ({ onTimeBlockChange, currentTimeBlock }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getCurrentTime();
      const newBlock = getCurrentTimeBlock();
      
      setCurrentTime(newTime);
      
      // Check if time block changed
      if (newBlock !== currentTimeBlock) {
        onTimeBlockChange(newBlock);
      }
      
      // Update time remaining
      const remaining = getTimeUntilNextBlock();
      setTimeRemaining(formatTimeRemaining(remaining));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTimeBlock, onTimeBlockChange]);

  // Calculate clock hands rotation
  const time = new Date();
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  // Calculate quadrant for current time block
  const getQuadrantClass = (blockId) => {
    const quadrants = {
      1: 'quadrant-1', // 12-3 o'clock
      2: 'quadrant-2', // 3-6 o'clock  
      3: 'quadrant-3', // 6-9 o'clock
      4: 'quadrant-4', // 9-12 o'clock
      5: 'quadrant-1', // 12-3 o'clock
      6: 'quadrant-2'  // 3-6 o'clock
    };
    return quadrants[blockId] || '';
  };

  return (
    <div className="clock-container">
      <div className="clock-face">
        {/* Quadrant highlighting */}
        <div className={`quadrant ${getQuadrantClass(currentTimeBlock)}`}></div>
        
        {/* Hour markers (ticks) */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = i * 6;
          const isHour = i % 5 === 0;
          return (
            <div
              key={i}
              className={`clock-tick ${isHour ? 'hour-tick' : 'minute-tick'}`}
              style={{
                transform: `rotate(${angle}deg) translateY(-140px)`,
              }}
            />
          );
        })}
        
        {/* Clock numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
          <div
            key={num}
            className="clock-number"
            style={{
              transform: `rotate(${num * 30}deg) translateY(-140px)`,
            }}
          >
            {num}
          </div>
        ))}
        
        {/* Clock hands */}
        <div
          className="clock-hand hour-hand"
          style={{ transform: `rotate(${hourAngle}deg)` }}
        ></div>
        <div
          className="clock-hand minute-hand"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        ></div>
        <div
          className="clock-hand second-hand"
          style={{ transform: `rotate(${secondAngle}deg)` }}
        ></div>
        
        {/* Center dot */}
        <div className="clock-center"></div>
      </div>
      
      {/* Digital time display */}
      <div className="digital-time">
        <div className="time-display">{currentTime}</div>
        <div className="time-remaining">Next block in: {timeRemaining}</div>
      </div>
    </div>
  );
};

export default Clock;
