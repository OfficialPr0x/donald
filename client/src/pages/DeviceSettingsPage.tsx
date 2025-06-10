import React, { useState, useEffect } from 'react';
import { View, useAppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { useDevice } from '../hooks/useDevice';
import deviceService from '../services/deviceService';
import Button from '../components/Button';

type Props = {
  setCurrentView: (view: View) => void;
};

const DeviceSettingsPage: React.FC<Props> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const { deviceStatus, deviceInfo, refreshStatus } = useDevice();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slideMin, setSlideMin] = useState<number>(0);
  const [slideMax, setSlideMax] = useState<number>(100);
  const [fixedRange, setFixedRange] = useState<boolean>(false);
  const [clientServerOffset, setClientServerOffset] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hstpStatus, setHstpStatus] = useState<any>(null);
  const [currentMode, setCurrentMode] = useState<number | null>(null);

  // Load current settings
  useEffect(() => {
    if (user?.id && deviceStatus === 'connected') {
      loadDeviceSettings();
    }
  }, [user?.id, deviceStatus]);

  // Load device settings
  const loadDeviceSettings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get device status including slide settings
      const status = await deviceService.getStatus(user.id);
      
      if (status.connected) {
        // Set slide settings
        if (status.slide) {
          setSlideMin(status.slide.min);
          setSlideMax(status.slide.max);
        }
        
        // Set current mode
        if (status.mode) {
          setCurrentMode(status.mode.mode);
        }
        
        // Get HSTP status
        try {
          const hstp = await deviceService.getHstpStatus(user.id);
          setHstpStatus(hstp);
        } catch (err) {
          console.warn('Error getting HSTP status:', err);
          // Non-critical error, don't show to user
        }
      }
    } catch (err: any) {
      console.error('Error loading device settings:', err);
      setError(err.message || 'Failed to load device settings');
    } finally {
      setLoading(false);
    }
  };

  // Save slide settings
  const saveSlideSettings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await deviceService.setSlideSettings(user.id, slideMin, slideMax, fixedRange);
      
      setSuccess('Slide settings saved successfully');
      
      // Refresh device status
      await refreshStatus();
    } catch (err: any) {
      console.error('Error saving slide settings:', err);
      setError(err.message || 'Failed to save slide settings');
    } finally {
      setLoading(false);
    }
  };

  // Calculate client-server offset
  const calculateOffset = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      setSuccess(null);
      
      const result = await deviceService.calculateOffset(30);
      setClientServerOffset(result.offset);
      
      setSuccess('Offset calculated successfully');
    } catch (err: any) {
      console.error('Error calculating offset:', err);
      setError(err.message || 'Failed to calculate offset');
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync HSTP time
  const syncHstpTime = async () => {
    if (!user?.id) return;
    
    try {
      setIsSyncing(true);
      setError(null);
      setSuccess(null);
      
      await deviceService.syncTime(user.id);
      
      // Get updated HSTP status
      const hstp = await deviceService.getHstpStatus(user.id);
      setHstpStatus(hstp);
      
      setSuccess('Device time synchronized successfully');
    } catch (err: any) {
      console.error('Error syncing time:', err);
      setError(err.message || 'Failed to sync time');
    } finally {
      setIsSyncing(false);
    }
  };

  // Start HSTP sync process
  const startHstpSync = async () => {
    if (!user?.id) return;
    
    try {
      setIsSyncing(true);
      setError(null);
      setSuccess(null);
      
      await deviceService.startHstpSync(user.id, 30000);
      
      // Get updated HSTP status
      const hstp = await deviceService.getHstpStatus(user.id);
      setHstpStatus(hstp);
      
      setSuccess('HSTP sync started successfully');
    } catch (err: any) {
      console.error('Error starting HSTP sync:', err);
      setError(err.message || 'Failed to start HSTP sync');
    } finally {
      setIsSyncing(false);
    }
  };

  // Change device mode
  const changeDeviceMode = async (mode: number) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await deviceService.setDeviceMode(user.id, mode);
      
      setCurrentMode(mode);
      setSuccess(`Device mode changed to ${getModeNameById(mode)}`);
      
      // Refresh device status
      await refreshStatus();
    } catch (err: any) {
      console.error('Error changing device mode:', err);
      setError(err.message || 'Failed to change device mode');
    } finally {
      setLoading(false);
    }
  };

  // Get mode name by ID
  const getModeNameById = (modeId: number): string => {
    switch (modeId) {
      case 0: return 'HAMP';
      case 1: return 'HDSP';
      case 2: return 'HSSP';
      case 3: return 'MAINTENANCE';
      default: return 'Unknown';
    }
  };

  // Format firmware status
  const formatFirmwareStatus = (status: number): string => {
    switch (status) {
      case 0: return 'Up to date';
      case 1: return 'Update available';
      case 2: return 'Update required';
      default: return 'Unknown';
    }
  };

  // Return to device page
  const goBack = () => {
    setCurrentView('device');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Device Settings</h1>
        <Button onClick={goBack} variant="outline">Back</Button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-300 text-green-700 text-sm rounded">
          {success}
        </div>
      )}
      
      {deviceStatus !== 'connected' ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Device not connected</p>
          <Button 
            onClick={() => setCurrentView('connect')}
            className="mt-4"
          >
            Connect Device
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Device Information */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-3">Device Information</h2>
            
            {deviceInfo && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span>{deviceInfo.model || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hardware Version:</span>
                  <span>{deviceInfo.hwVersion || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Firmware Version:</span>
                  <span>{deviceInfo.fwVersion || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Firmware Status:</span>
                  <span className={deviceInfo.fwStatus === 2 ? 'text-red-600 font-medium' : ''}>
                    {formatFirmwareStatus(deviceInfo.fwStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Mode:</span>
                  <span>{currentMode !== null ? getModeNameById(currentMode) : 'Unknown'}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={refreshStatus}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={loading}
              >
                Refresh Device Info
              </Button>
            </div>
          </section>
          
          {/* Mode Selection */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-3">Device Mode</h2>
            <p className="text-sm text-gray-600 mb-3">
              Select the device operating mode based on your usage:
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => changeDeviceMode(0)}
                variant={currentMode === 0 ? 'primary' : 'outline'}
                size="sm"
                disabled={loading}
              >
                HAMP Mode
              </Button>
              <Button 
                onClick={() => changeDeviceMode(1)}
                variant={currentMode === 1 ? 'primary' : 'outline'}
                size="sm"
                disabled={loading}
              >
                HDSP Mode
              </Button>
              <Button 
                onClick={() => changeDeviceMode(2)}
                variant={currentMode === 2 ? 'primary' : 'outline'}
                size="sm"
                disabled={loading}
              >
                HSSP Mode
              </Button>
              <Button 
                onClick={() => changeDeviceMode(3)}
                variant={currentMode === 3 ? 'primary' : 'outline'}
                size="sm"
                disabled={loading}
              >
                Maintenance
              </Button>
            </div>
            
            <div className="mt-3 text-xs text-gray-600">
              <p><strong>HAMP:</strong> Basic automatic movement (velocity control)</p>
              <p><strong>HDSP:</strong> Direct position control in real-time</p>
              <p><strong>HSSP:</strong> Synchronized script playback</p>
            </div>
          </section>
          
          {/* Slide Settings */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-3">Slide Settings</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Position: {slideMin}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={slideMin}
                onChange={(e) => setSlideMin(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Position: {slideMax}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={slideMax}
                onChange={(e) => setSlideMax(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                disabled={loading}
              />
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="fixedRange"
                checked={fixedRange}
                onChange={(e) => setFixedRange(e.target.checked)}
                className="mr-2"
                disabled={loading}
              />
              <label htmlFor="fixedRange" className="text-sm text-gray-700">
                Maintain range size when changing values
              </label>
            </div>
            
            <Button 
              onClick={saveSlideSettings}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Slide Settings'}
            </Button>
          </section>
          
          {/* Time Synchronization */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-3">Time Synchronization</h2>
            
            <div className="mb-4 text-sm text-gray-600">
              <p>
                Time synchronization is crucial for script playback. The client-server 
                offset helps ensure that scripts play at the correct timing.
              </p>
            </div>
            
            {clientServerOffset !== null && (
              <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <p><strong>Client-Server Offset:</strong> {clientServerOffset.toFixed(2)}ms</p>
                <p><strong>Estimated Server Time:</strong> {new Date(Date.now() + clientServerOffset).toLocaleTimeString()}</p>
              </div>
            )}
            
            {hstpStatus && (
              <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">HSTP Enabled:</span>
                  <span>{hstpStatus.enabled ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sync Required:</span>
                  <span className={hstpStatus.syncRequired ? 'text-red-600 font-medium' : ''}>
                    {hstpStatus.syncRequired ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sync In Progress:</span>
                  <span>{hstpStatus.syncInProgress ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={calculateOffset}
                variant="outline"
                disabled={isSyncing}
              >
                {isSyncing ? 'Calculating...' : 'Calculate Offset'}
              </Button>
              
              <Button 
                onClick={syncHstpTime}
                variant="outline"
                disabled={isSyncing}
              >
                {isSyncing ? 'Syncing...' : 'Sync Device Time'}
              </Button>
              
              <Button 
                onClick={startHstpSync}
                className="col-span-2"
                disabled={isSyncing}
              >
                {isSyncing ? 'Starting Sync...' : 'Start Full HSTP Sync'}
              </Button>
            </div>
          </section>
          
          {/* Firmware Update */}
          {deviceInfo && deviceInfo.fwStatus !== 0 && (
            <section className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-3">Firmware Update</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {deviceInfo.fwStatus === 2 
                    ? 'Your device firmware needs to be updated to use all features.' 
                    : 'A firmware update is available for your device.'}
                </p>
              </div>
              
              <Button 
                onClick={() => window.open('https://www.handyfeeling.com', '_blank')}
                className="w-full"
              >
                Update Firmware
              </Button>
              
              <p className="mt-2 text-xs text-gray-500">
                Firmware updates are performed on the handyfeeling.com website.
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceSettingsPage;