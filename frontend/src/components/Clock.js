import React, { useState, useEffect } from 'react';
import {
  getCurrentTime,
  getCurrentTimeBlock,
  getTimeUntilNextBlock,
  formatTimeRemaining,
} from '../utils/timeUtils';
import './Clock.css';

const Clock = ({ onTimeBlockChange, currentTimeBlock }) => {
  const [time, setTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const newBlock = getCurrentTimeBlock();
      
      // Trigger callback if block changed
      if (newBlock?.id !== currentTimeBlock?.id) {
        onTimeBlockChange(newBlock);
      }

      // Update time remaining
      const remaining = getTimeUntilNextBlock();
      setTimeRemaining(formatTimeRemaining(remaining));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTimeBlock, onTimeBlockChange]);

  // Calculate smooth hand rotations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Smooth rotation calculations
  const secondAngle = (seconds + milliseconds / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = (hours + minutes / 60 + seconds / 3600) * 30;

  const RADIUS = 140;

  // Time block highlighting logic (keeping your existing functionality)
  const toMinutes = (t) => {
    if (!t) return 0;
    const [hh, mm] = String(t).split(':');
    return (parseInt(hh, 10) % 24) * 60 + parseInt(mm || '0', 10);
  };

  const toDegOn12h = (mins24) => {
    const mins12 = mins24 % 720;
    return mins12 * 0.5;
  };

  const sectorPath = (startDeg, endDeg, r) => {
    let s = startDeg % 360;
    let e = endDeg % 360;
    if (e < s) e += 360;
    const delta = e - s;
    const largeArc = delta > 180 ? 1 : 0;

    const toXY = (deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return [r * Math.cos(rad), r * Math.sin(rad)];
    };

    const [x1, y1] = toXY(s);
    const [x2, y2] = toXY(e);
    return `M 0 0 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
  };

  // Compute time block sector
  let startDeg = 0;
  let endDeg = 0;
  if (currentTimeBlock && currentTimeBlock.start_time && currentTimeBlock.end_time) {
    const startM = toMinutes(currentTimeBlock.start_time);
    const endM = toMinutes(currentTimeBlock.end_time);
    startDeg = toDegOn12h(startM);
    endDeg = toDegOn12h(endM);
  }

  const currentTimeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="clock-container">
      <div className="clock-face">
        {/* Time block sector highlight */}
        {currentTimeBlock && (
          <svg
            className="clock-overlay"
            viewBox={`-${RADIUS} -${RADIUS} ${RADIUS * 2} ${RADIUS * 2}`}
            aria-hidden
          >
            <path d={sectorPath(startDeg, endDeg, RADIUS - 10)} className="active-sector" />
          </svg>
        )}

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`hour-${i}`}
            className="hour-marker"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-${RADIUS - 15}px)`,
            }}
          />
        ))}

        {/* Minute markers */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 !== 0) {
            return (
              <div
                key={`minute-${i}`}
                className="minute-marker"
                style={{
                  transform: `rotate(${i * 6}deg) translateY(-${RADIUS - 8}px)`,
                }}
              />
            );
          }
          return null;
        })}

        {/* Hour numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
          const angle = num * 30; // 30 degrees per hour
          const radius = 120; // Distance from center
          const radian = ((angle - 90) * Math.PI) / 180; // Convert to radians, -90 to start at 12
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          
          return (
            <div
              key={num}
              className="hour-number"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Clock hands */}
        <div 
          className="clock-hand hour-hand" 
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />
        <div 
          className="clock-hand minute-hand" 
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />
        <div 
          className="clock-hand second-hand" 
          style={{ transform: `rotate(${secondAngle}deg)` }}
        />

        {/* Center hub */}
        <div className="clock-center" />
      </div>

      {/* Digital display */}
      <div className="digital-time">
        <div className="time-display">{currentTimeString}</div>
        <div className="time-remaining">Next block in: {timeRemaining}</div>
      </div>
    </div>
  );
};

export default Clock;
