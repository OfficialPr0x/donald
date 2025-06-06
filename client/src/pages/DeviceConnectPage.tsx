import React, { useState } from 'react';
import { View, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function DeviceConnectPage({ setCurrentView }: Props) {
  const { deviceKey, setDeviceKey, setDeviceConnected, setUser } = useAppContext();
  const [deviceStatus, setDeviceStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceKey) {
      alert('Please enter your Handy Connection Key');
      return;
    }
    
    // Simulate API call to Handy
    setIsConnecting(true);
    console.log('Connecting to Handy with key:', deviceKey);
    
    // Mock successful connection
    setTimeout(() => {
      setDeviceStatus('connected');
      setDeviceConnected(true);
      setIsConnecting(false);
      
      // Move to preferences
      setCurrentView('preferences');
    }, 1500);
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    setDeviceConnected(false);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Connect Your Device</h1>
        <p className="text-center text-gray-600 mb-6">Enter your Handy Connection Key to connect</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="deviceKey" className="block text-sm font-medium text-gray-700 mb-1">Connection Key</label>
            <input 
              type="text" 
              id="deviceKey" 
              required 
              placeholder="Enter your Handy connection key" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={deviceKey}
              onChange={(e) => setDeviceKey(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">Find this in your Handy app settings</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${deviceStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300'} ${isConnecting ? 'animate-pulse' : ''}`}></div>
              <span className="mt-1 text-xs text-gray-600">{deviceStatus}</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Device'}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center">
            Need help? <a href="#" className="text-blue-600 hover:underline">View connection guide</a>
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