import React from 'react';
import { Voice } from '../App';

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voice: Voice) => void;
  className?: string;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  onSelect,
  className = ''
}) => {
  const handleClick = () => {
    onSelect(voice);
  };

  return (
    <div
      className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <div className="font-medium">{voice.name}</div>
      <div className="text-xs text-gray-600 mt-1">{voice.description}</div>
      
      {isSelected && (
        <div className="mt-2 flex items-center justify-end">
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <span className="ml-1 text-xs text-blue-600">Selected</span>
        </div>
      )}
    </div>
  );
};

export default VoiceCard; 