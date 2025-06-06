import { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../App';
import deviceService, { DeviceStatus } from '../services/deviceService';
import { useAuth } from './useAuth';

export function useDevice() {
  const { deviceKey, setDeviceKey, deviceConnected, setDeviceConnected } = useAppContext();
  const { user } = useAuth();
  const [deviceStatus, setDeviceStatus] = useState<string>(deviceConnected ? 'connected' : 'disconnected');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [strokeSpeed, setStrokeSpeed] = useState<number>(50);
  const [strokePosition, setStrokePosition] = useState<number>(50);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch device status on mount if connected
  useEffect(() => {
    if (deviceConnected && user?.id) {
      fetchDeviceStatus();
    }
  }, [deviceConnected, user?.id]);

  // Fetch device status
  const fetchDeviceStatus = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const status: DeviceStatus = await deviceService.getStatus(user.id);
      
      if (status.connected) {
        setDeviceStatus('connected');
        setDeviceConnected(true);
        setDeviceInfo(status.deviceInfo);
        
        // If slide settings are available, update stroke position
        if (status.slide) {
          const avgPosition = Math.round((status.slide.min + status.slide.max) / 2);
          setStrokePosition(avgPosition);
        }
      } else {
        setDeviceStatus('disconnected');
        setDeviceConnected(false);
      }
    } catch (err) {
      console.error('Error fetching device status:', err);
      setDeviceStatus('error');
      setError('Failed to get device status');
    } finally {
      setLoading(false);
    }
  }, [user?.id, setDeviceConnected]);

  // Connect to device with connection key
  const connectDevice = useCallback(async (key: string): Promise<boolean> => {
    if (!key) {
      setError('Please enter a valid connection key');
      return false;
    }
    
    if (!user?.id) {
      setError('User must be logged in to connect a device');
      return false;
    }

    try {
      setDeviceKey(key);
      setIsConnecting(true);
      setDeviceStatus('connecting');
      setError(null);
      
      // Pair the device with the user
      const result = await deviceService.pairDevice(user.id, key);
      
      // Fetch the device status to confirm connection
      await fetchDeviceStatus();
      
      setDeviceStatus('connected');
      setDeviceConnected(true);
      setDeviceInfo(result.deviceInfo);
      
      return true;
    } catch (err: any) {
      console.error('Error connecting device:', err);
      setDeviceStatus('error');
      setError(err.message || 'Failed to connect device');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [user?.id, setDeviceKey, setDeviceConnected, fetchDeviceStatus]);

  // Disconnect from device
  const disconnectDevice = useCallback(() => {
    setDeviceConnected(false);
    setDeviceStatus('disconnected');
    setDeviceInfo(null);
    setStrokeSpeed(0);
  }, [setDeviceConnected]);

  // Control device stroke speed
  const setSpeed = useCallback(async (speed: number) => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    if (speed < 0 || speed > 100) {
      setError('Speed must be between 0 and 100');
      return;
    }
    
    try {
      setError(null);
      await deviceService.setVelocity(user.id, speed);
      setStrokeSpeed(speed);
    } catch (err: any) {
      console.error('Error setting device speed:', err);
      setError(err.message || 'Failed to set device speed');
    }
  }, [user?.id]);

  // Control device stroke position
  const setPosition = useCallback(async (position: number) => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    if (position < 0 || position > 100) {
      setError('Position must be between 0 and 100');
      return;
    }
    
    try {
      setError(null);
      await deviceService.setPosition(user.id, position);
      setStrokePosition(position);
    } catch (err: any) {
      console.error('Error setting device position:', err);
      setError(err.message || 'Failed to set device position');
    }
  }, [user?.id]);

  // Pause device (stop movement)
  const pauseDevice = useCallback(async () => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    try {
      setError(null);
      await deviceService.stopDevice(user.id);
      setStrokeSpeed(0);
    } catch (err: any) {
      console.error('Error pausing device:', err);
      setError(err.message || 'Failed to pause device');
    }
  }, [user?.id]);

  // Stop device
  const stopDevice = useCallback(async () => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    try {
      setError(null);
      await deviceService.stopDevice(user.id);
      setStrokeSpeed(0);
    } catch (err: any) {
      console.error('Error stopping device:', err);
      setError(err.message || 'Failed to stop device');
    }
  }, [user?.id]);

  // Execute predefined patterns
  const executePattern = useCallback(async (pattern: 'edge' | 'speed' | 'slow' | 'stop' | 'pause' | 'default') => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    try {
      setError(null);
      
      if (pattern === 'stop') {
        await stopDevice();
        return;
      }
      
      if (pattern === 'pause') {
        await pauseDevice();
        return;
      }
      
      // For other patterns, use the deviceService
      await deviceService.executePattern(
        user.id, 
        pattern as 'edge' | 'speed' | 'slow' | 'default',
        { currentVelocity: strokeSpeed }
      );
      
      // Update local state based on pattern
      switch (pattern) {
        case 'speed':
          setStrokeSpeed(Math.min(strokeSpeed + 20, 100));
          break;
        case 'slow':
          setStrokeSpeed(Math.max(strokeSpeed - 20, 10));
          break;
        case 'default':
          setStrokeSpeed(50);
          break;
      }
    } catch (err: any) {
      console.error('Error executing pattern:', err);
      setError(err.message || 'Failed to execute pattern');
    }
  }, [user?.id, strokeSpeed, stopDevice, pauseDevice]);

  // Check device firmware status
  const checkFirmware = useCallback(async () => {
    if (!user?.id) {
      setError('User must be logged in to check device firmware');
      return null;
    }
    
    try {
      setError(null);
      return await deviceService.checkFirmware(user.id);
    } catch (err: any) {
      console.error('Error checking firmware:', err);
      setError(err.message || 'Failed to check firmware');
      return null;
    }
  }, [user?.id]);

  // Start device movement
  const startDevice = useCallback(async (velocity?: number) => {
    if (!user?.id) {
      setError('User must be logged in to control device');
      return;
    }
    
    try {
      setError(null);
      await deviceService.startDevice(user.id, velocity);
      if (velocity !== undefined) {
        setStrokeSpeed(velocity);
      }
    } catch (err: any) {
      console.error('Error starting device:', err);
      setError(err.message || 'Failed to start device');
    }
  }, [user?.id]);

  return {
    deviceKey,
    deviceStatus,
    isConnecting,
    strokeSpeed,
    strokePosition,
    isConnected: deviceConnected,
    deviceInfo,
    error,
    loading,
    connectDevice,
    disconnectDevice,
    setSpeed,
    setPosition,
    pauseDevice,
    stopDevice,
    startDevice,
    executePattern,
    checkFirmware,
    refreshStatus: fetchDeviceStatus
  };
} 