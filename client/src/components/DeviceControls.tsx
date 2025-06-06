import React, { useState, useEffect } from 'react';
import { useDevice } from '../hooks/useDevice';
import Button from './Button';

interface DeviceControlsProps {
  userId: string;
  showStatus?: boolean;
  className?: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ 
  userId, 
  showStatus = true,
  className = ''
}) => {
  const { 
    deviceStatus, 
    strokeSpeed, 
    strokePosition,
    deviceInfo,
    error,
    loading,
    refreshStatus,
    setSpeed,
    setPosition,
    startDevice,
    stopDevice,
    executePattern
  } = useDevice();

  const [speed, setSpeedValue] = useState(strokeSpeed);
  const [position, setPositionValue] = useState(strokePosition);

  // Update local state when device state changes
  useEffect(() => {
    setSpeedValue(strokeSpeed);
    setPositionValue(strokePosition);
  }, [strokeSpeed, strokePosition]);

  // Refresh device status
  useEffect(() => {
    refreshStatus();
    // Set up a polling interval for device status
    const interval = setInterval(() => {
      refreshStatus();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [refreshStatus]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeedValue(newSpeed);
  };

  const handleSpeedSet = () => {
    setSpeed(speed);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value, 10);
    setPositionValue(newPosition);
  };

  const handlePositionSet = () => {
    setPosition(position);
  };

  const handleStart = () => {
    startDevice(speed);
  };

  const handleStop = () => {
    stopDevice();
  };

  const handlePatternExecute = (pattern: 'edge' | 'speed' | 'slow' | 'stop' | 'pause' | 'default') => {
    executePattern(pattern);
  };

  if (loading && !deviceStatus) {
    return (
      <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
        <div className="flex justify-center items-center h-40">
          <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Device not connected
  if (deviceStatus === 'disconnected' || deviceStatus === 'error') {
    return (
      <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
        <div className="text-center py-6">
          <div className="flex justify-center">
            <div className="h-4 w-4 rounded-full bg-red-500 mb-2"></div>
          </div>
          <h3 className="font-medium text-lg mb-2">Device Not Connected</h3>
          <p className="text-gray-600 text-sm mb-4">
            {error || "Your device is not connected or has gone offline."}
          </p>
          <Button onClick={refreshStatus}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      {showStatus && (
        <div className="mb-4 flex items-center">
          <div className={`h-3 w-3 rounded-full ${deviceStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
          <span className="text-sm font-medium">
            {deviceStatus === 'connected' ? 'Connected' : deviceStatus}
          </span>
          {deviceInfo && (
            <span className="text-xs text-gray-500 ml-2">
              {deviceInfo.model} (FW: {deviceInfo.fwVersion})
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Speed: {speed}%
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={handleSpeedChange}
              onMouseUp={handleSpeedSet}
              onTouchEnd={handleSpeedSet}
              className="flex-grow h-2 appearance-none rounded-lg bg-gray-200 slider-thumb"
            />
            <Button size="sm" className="ml-2" onClick={handleSpeedSet}>
              Set
            </Button>
          </div>
        </div>

        {/* Position Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position: {position}%
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={handlePositionChange}
              onMouseUp={handlePositionSet}
              onTouchEnd={handlePositionSet}
              className="flex-grow h-2 appearance-none rounded-lg bg-gray-200 slider-thumb"
            />
            <Button size="sm" className="ml-2" onClick={handlePositionSet}>
              Set
            </Button>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex space-x-2">
          <Button 
            onClick={handleStart}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Start
          </Button>
          <Button 
            onClick={handleStop}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Stop
          </Button>
        </div>

        {/* Pattern Controls */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Patterns</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              onClick={() => handlePatternExecute('edge')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Edge
            </Button>
            <Button 
              size="sm" 
              onClick={() => handlePatternExecute('speed')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Faster
            </Button>
            <Button 
              size="sm" 
              onClick={() => handlePatternExecute('slow')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Slower
            </Button>
            <Button 
              size="sm" 
              onClick={() => handlePatternExecute('default')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Default
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeviceControls; 