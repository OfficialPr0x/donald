import React from 'react';
import Button from './Button';

interface DeviceControlsProps {
  strokeSpeed: number;
  strokePosition: number;
  onSpeedChange: (speed: number) => void;
  onPositionChange: (position: number) => void;
  onPause: () => void;
  onStop: () => void;
  voiceName?: string;
  style?: string;
  className?: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({
  strokeSpeed,
  strokePosition,
  onSpeedChange,
  onPositionChange,
  onPause,
  onStop,
  voiceName = 'AI Companion',
  style = 'Default',
  className = ''
}) => {
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(parseInt(e.target.value));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange(parseInt(e.target.value));
  };

  return (
    <div className={`bg-gray-50 p-4 ${className}`}>
      <h2 className="font-medium text-lg mb-4">Device Controls</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={strokeSpeed} 
          onChange={handleSpeedChange}
          className="slider w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Slow</span>
          <span>{strokeSpeed}%</span>
          <span>Fast</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={strokePosition}
          onChange={handlePositionChange}
          className="slider w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Top</span>
          <span>{strokePosition}%</span>
          <span>Bottom</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-8">
        <Button
          variant="outline"
          onClick={onPause}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          Pause
        </Button>
        <Button
          variant="danger"
          onClick={onStop}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          }
        >
          Stop
        </Button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-1"><strong>Connected as:</strong> {voiceName}</p>
          <p><strong>Style:</strong> {style}</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceControls; 