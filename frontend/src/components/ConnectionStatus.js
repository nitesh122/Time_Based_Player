import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkConnection = async () => {
    try {
      setIsChecking(true);
      await healthCheck();
      setIsConnected(true);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    if (isChecking) return 'Checking connection...';
    if (isConnected) return 'Connected to API';
    return 'Disconnected from API';
  };

  const getStatusIcon = () => {
    if (isChecking) return '🔄';
    if (isConnected) return '✅';
    return '❌';
  };

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-text">{getStatusText()}</span>
      </div>
      {lastChecked && (
        <div className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
      {!isConnected && !isChecking && (
        <button 
          className="retry-btn"
          onClick={checkConnection}
          disabled={isChecking}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
