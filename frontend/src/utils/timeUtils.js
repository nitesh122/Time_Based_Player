// Get current time in HH:MM format
export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

// Get current time block (1-6)
export const getCurrentTimeBlock = () => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 0 && hour < 4) return 1;   // 00:00-03:59
  if (hour >= 4 && hour < 8) return 2;   // 04:00-07:59
  if (hour >= 8 && hour < 12) return 3;  // 08:00-11:59
  if (hour >= 12 && hour < 16) return 4; // 12:00-15:59
  if (hour >= 16 && hour < 20) return 5; // 16:00-19:59
  if (hour >= 20 && hour < 24) return 6; // 20:00-23:59
  
  return 1; // Default fallback
};

// Get time until next block change
export const getTimeUntilNextBlock = () => {
  const now = new Date();
  const currentBlock = getCurrentTimeBlock();
  const hour = now.getHours();
  
  let nextBlockHour;
  switch (currentBlock) {
    case 1: nextBlockHour = 4; break;
    case 2: nextBlockHour = 8; break;
    case 3: nextBlockHour = 12; break;
    case 4: nextBlockHour = 16; break;
    case 5: nextBlockHour = 20; break;
    case 6: nextBlockHour = 24; break;
    default: nextBlockHour = 4;
  }
  
  const nextBlockTime = new Date(now);
  nextBlockTime.setHours(nextBlockHour, 0, 0, 0);
  
  if (nextBlockHour === 24) {
    nextBlockTime.setDate(nextBlockTime.getDate() + 1);
    nextBlockTime.setHours(0, 0, 0, 0);
  }
  
  return nextBlockTime.getTime() - now.getTime();
};

// Format time remaining
export const formatTimeRemaining = (milliseconds) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Get block name
export const getBlockName = (blockId) => {
  const blockNames = {
    1: 'Midnight Chill',
    2: 'Sunrise Calm', 
    3: 'Morning Energy',
    4: 'Afternoon Focus',
    5: 'Evening Relax',
    6: 'Night Vibes'
  };
  return blockNames[blockId] || 'Unknown Block';
};

// Get block description
export const getBlockDescription = (blockId) => {
  const descriptions = {
    1: 'Relaxing music for late night',
    2: 'Peaceful morning vibes',
    3: 'Upbeat music to start the day',
    4: 'Productive midday music',
    5: 'Wind down after work',
    6: 'Late evening atmosphere'
  };
  return descriptions[blockId] || 'Music for this time of day';
};
