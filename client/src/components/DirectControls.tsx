import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import deviceService from '../services/deviceService';
import Button from './Button';

interface DirectControlsProps {
  onError?: (error: Error) => void;
  className?: string;
}

const DirectControls: React.FC<DirectControlsProps> = ({ 
  onError,
  className = '' 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number>(50);
  const [inHdspMode, setInHdspMode] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastSent, setLastSent] = useState<number | null>(null);
  const sendThrottleRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize component
  useEffect(() => {
    if (user?.id) {
      checkDeviceMode();
    }
    
    return () => {
      // Clear any pending throttled sends
      if (sendThrottleRef.current) {
        clearTimeout(sendThrottleRef.current);
      }
    };
  }, [user?.id]);

  // Check device mode
  const checkDeviceMode = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get device status
      const status = await deviceService.getStatus(user.id);
      
      if (status.connected && status.mode) {
        setInHdspMode(status.mode.mode === 1); // 1 = HDSP mode
      } else {
        setInHdspMode(false);
      }
    } catch (err: any) {
      console.error('Error checking device mode:', err);
      setError(err.message || 'Failed to check device mode');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  // Switch to HDSP mode
  const switchToHdspMode = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Set device mode to HDSP (1)
      await deviceService.setDeviceMode(user.id, 1);
      
      setInHdspMode(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Error switching to HDSP mode:', err);
      setError(err.message || 'Failed to switch to HDSP mode');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  // Send position command, throttled to avoid overwhelming the device
  const sendPosition = (pos: number) => {
    if (!user?.id || !inHdspMode) return;
    
    // Clear any pending sends
    if (sendThrottleRef.current) {
      clearTimeout(sendThrottleRef.current);
    }
    
    // Update local position state immediately for UI feedback
    setPosition(pos);
    
    // Throttle sending to device (no more than one command every 100ms)
    sendThrottleRef.current = setTimeout(async () => {
      try {
        setIsSending(true);
        
        await deviceService.sendDirectPosition(user.id, pos);
        
        setLastSent(pos);
        setIsSending(false);
      } catch (err: any) {
        console.error('Error sending position:', err);
        setError(err.message || 'Failed to send position');
        setIsSending(false);
        if (onError) onError(err);
      }
    }, 100);
  };

  // Handle position change from slider
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value, 10);
    sendPosition(newPosition);
  };

  // Handle preset position buttons
  const handlePresetPosition = (pos: number) => {
    sendPosition(pos);
  };

  // Rapid movements for interactive control
  const startOscillation = () => {
    if (!user?.id || !inHdspMode) return;
    
    // Oscillate between min and max position
    let isUp = true;
    let currentPos = 0;
    
    const interval = setInterval(() => {
      if (isUp) {
        currentPos += 10;
        if (currentPos >= 100) {
          currentPos = 100;
          isUp = false;
        }
      } else {
        currentPos -= 10;
        if (currentPos <= 0) {
          currentPos = 0;
          isUp = true;
        }
      }
      
      sendPosition(currentPos);
    }, 150); // 150ms interval for ~3.3Hz oscillation
    
    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      sendPosition(50); // Return to neutral position
    }, 10000);
  };

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <h3 className="text-lg font-medium mb-4">Direct Control (HDSP)</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      {!inHdspMode ? (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            Device needs to be in HDSP mode for direct control
          </p>
          <Button 
            onClick={switchToHdspMode}
            disabled={loading}
          >
            {loading ? 'Switching...' : 'Switch to HDSP Mode'}
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position: {position}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={handlePositionChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min</span>
              <span>{position}%</span>
              <span>Max</span>
            </div>
            
            {isSending && (
              <p className="text-xs text-blue-500 mt-1">Sending...</p>
            )}
            
            {lastSent !== null && (
              <p className="text-xs text-gray-500 mt-1">Last sent: {lastSent}%</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Button
              size="sm"
              onClick={() => handlePresetPosition(0)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Min (0%)
            </Button>
            <Button
              size="sm"
              onClick={() => handlePresetPosition(50)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Mid (50%)
            </Button>
            <Button
              size="sm"
              onClick={() => handlePresetPosition(100)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Max (100%)
            </Button>
          </div>
          
          <div className="mb-4">
            <Button
              onClick={startOscillation}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              Start Oscillation (10s)
            </Button>
          </div>
          
          <p className="text-xs text-gray-600 mt-4">
            HDSP mode provides real-time direct control of the device position with minimal latency.
          </p>
        </>
      )}
    </div>
  );
};

export default DirectControls; 