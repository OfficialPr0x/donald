import React, { useState, useEffect } from 'react';
import { View, useAppContext } from '../App';
import { useDevice } from '../hooks/useDevice';
import { useAuth } from '../hooks/useAuth';

type Props = {
  setCurrentView: (view: View) => void;
};

function DeviceConnectPage({ setCurrentView }: Props) {
  const { setUser } = useAppContext();
  const { user } = useAuth();
  const { 
    deviceKey, 
    deviceStatus, 
    isConnecting, 
    error, 
    deviceInfo,
    connectDevice, 
    checkFirmware 
  } = useDevice();
  
  const [connectionKey, setConnectionKey] = useState(deviceKey || '');
  const [firmwareStatus, setFirmwareStatus] = useState<any>(null);

  // Check firmware status when device info is available
  useEffect(() => {
    if (deviceInfo && user?.id) {
      checkFirmwareStatus();
    }
  }, [deviceInfo, user?.id]);

  const checkFirmwareStatus = async () => {
    const status = await checkFirmware();
    if (status) {
      setFirmwareStatus(status);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectionKey) {
      alert('Please enter your Handy Connection Key');
      return;
    }
    
    try {
      const connected = await connectDevice(connectionKey);
      
      if (connected) {
        // Move to preferences after successful connection
        setTimeout(() => {
          setCurrentView('preferences');
        }, 1000);
      }
    } catch (err) {
      console.error('Error connecting device:', err);
    }
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  const getFirmwareStatusDisplay = () => {
    if (!firmwareStatus) return null;
    
    let statusColor = 'text-gray-600';
    if (firmwareStatus.updateRequired) {
      statusColor = 'text-red-600';
    } else if (firmwareStatus.firmwareStatus === 1) {
      statusColor = 'text-yellow-600';
    } else {
      statusColor = 'text-green-600';
    }
    
    return (
      <div className="mt-4 p-3 border rounded">
        <h3 className="text-sm font-medium">Firmware Status</h3>
        <p className={`text-sm ${statusColor}`}>{firmwareStatus.updateMessage}</p>
        <p className="text-xs text-gray-500">Version: {firmwareStatus.currentVersion}</p>
        
        {firmwareStatus.updateRequired && (
          <a 
            href="https://www.handyfeeling.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline mt-2 block"
          >
            Update Firmware
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Connect Your Device</h1>
        <p className="text-center text-gray-600 mb-6">Enter your Handy Connection Key to connect</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="connectionKey" className="block text-sm font-medium text-gray-700 mb-1">Connection Key</label>
            <input 
              type="text" 
              id="connectionKey" 
              required 
              placeholder="Enter your Handy connection key" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionKey}
              onChange={(e) => setConnectionKey(e.target.value)}
              disabled={isConnecting}
            />
            <p className="mt-1 text-xs text-gray-500">Find this in your Handy app settings</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${
                deviceStatus === 'connected' ? 'bg-green-500' : 
                deviceStatus === 'error' ? 'bg-red-500' :
                deviceStatus === 'connecting' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
              }`}></div>
              <span className="mt-1 text-xs text-gray-600">{deviceStatus}</span>
            </div>
          </div>
          
          {deviceInfo && (
            <div className="p-3 border rounded">
              <h3 className="text-sm font-medium">Device Info</h3>
              <p className="text-xs text-gray-600">Model: {deviceInfo.model}</p>
              <p className="text-xs text-gray-600">HW Version: {deviceInfo.hwVersion}</p>
              <p className="text-xs text-gray-600">FW Version: {deviceInfo.fwVersion}</p>
            </div>
          )}
          
          {getFirmwareStatusDisplay()}
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-400"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : deviceStatus === 'connected' ? 'Continue to Settings' : 'Connect Device'}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center">
            Need help? <a href="https://www.handyfeeling.com/docs/api/v2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View connection guide</a>
          </p>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeviceConnectPage; 