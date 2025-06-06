import { useState, useCallback } from 'react';
import { useAppContext } from '../App';

export function useDevice() {
  const { deviceKey, setDeviceKey, deviceConnected, setDeviceConnected } = useAppContext();
  const [deviceStatus, setDeviceStatus] = useState(deviceConnected ? 'connected' : 'disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [strokeSpeed, setStrokeSpeed] = useState(50);
  const [strokePosition, setStrokePosition] = useState(50);

  // Connect to device with key
  const connectDevice = useCallback((key: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!key) {
        reject(new Error('Please enter a valid connection key'));
        return;
      }

      setDeviceKey(key);
      setIsConnecting(true);
      setDeviceStatus('connecting');

      // Simulate API call to Handy
      console.log('Connecting to Handy with key:', key);
      
      // Mock successful connection
      setTimeout(() => {
        setDeviceStatus('connected');
        setDeviceConnected(true);
        setIsConnecting(false);
        resolve(true);
      }, 1500);
    });
  }, [setDeviceKey, setDeviceConnected]);

  // Disconnect from device
  const disconnectDevice = useCallback(() => {
    setDeviceConnected(false);
    setDeviceStatus('disconnected');
    setStrokeSpeed(0);
    console.log('Device disconnected');
  }, [setDeviceConnected]);

  // Control device stroke speed
  const setSpeed = useCallback((speed: number) => {
    if (speed < 0 || speed > 100) {
      console.error('Speed must be between 0 and 100');
      return;
    }
    
    setStrokeSpeed(speed);
    
    // In production, would send command to device API
    console.log(`Setting stroke speed to ${speed}%`);
  }, []);

  // Control device stroke position
  const setPosition = useCallback((position: number) => {
    if (position < 0 || position > 100) {
      console.error('Position must be between 0 and 100');
      return;
    }
    
    setStrokePosition(position);
    
    // In production, would send command to device API
    console.log(`Setting stroke position to ${position}%`);
  }, []);

  // Pause device (set speed to 0)
  const pauseDevice = useCallback(() => {
    setStrokeSpeed(0);
    console.log('Device paused');
  }, []);

  // Stop device (set speed to 0)
  const stopDevice = useCallback(() => {
    setStrokeSpeed(0);
    console.log('Device stopped');
  }, []);

  // Execute predefined patterns
  const executePattern = useCallback((pattern: 'edge' | 'speed' | 'slow' | 'stop' | 'pause' | 'default') => {
    console.log('Executing pattern:', pattern);
    
    switch(pattern) {
      case 'edge':
        // Simulate edging pattern
        setStrokeSpeed(30);
        setTimeout(() => setStrokeSpeed(70), 3000);
        setTimeout(() => setStrokeSpeed(0), 5000);
        setTimeout(() => setStrokeSpeed(50), 7000);
        break;
      case 'speed':
        setStrokeSpeed(Math.min(strokeSpeed + 20, 100));
        break;
      case 'slow':
        setStrokeSpeed(Math.max(strokeSpeed - 20, 10));
        break;
      case 'stop':
        setStrokeSpeed(0);
        break;
      case 'pause':
        setStrokeSpeed(0);
        break;
      default:
        // Default pattern
        setStrokeSpeed(50);
    }
  }, [strokeSpeed]);

  return {
    deviceKey,
    deviceStatus,
    isConnecting,
    strokeSpeed,
    strokePosition,
    isConnected: deviceConnected,
    connectDevice,
    disconnectDevice,
    setSpeed,
    setPosition,
    pauseDevice,
    stopDevice,
    executePattern
  };
} 