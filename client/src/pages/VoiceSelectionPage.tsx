import React, { useState } from 'react';
import { View, Voice, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function VoiceSelectionPage({ setCurrentView }: Props) {
  const { selectedVoice, setSelectedVoice, setUser } = useAppContext();
  const [audioPlayer] = useState(new Audio());
  
  const voices: Voice[] = [
    { id: 'v1', name: 'Sophia', sample: 'https://example.com/sophia.mp3', description: 'Warm and nurturing' },
    { id: 'v2', name: 'Emma', sample: 'https://example.com/emma.mp3', description: 'Playful and teasing' },
    { id: 'v3', name: 'Victoria', sample: 'https://example.com/victoria.mp3', description: 'Dominant and assertive' },
    { id: 'v4', name: 'Lily', sample: 'https://example.com/lily.mp3', description: 'Shy and submissive' },
    { id: 'v5', name: 'Zoe', sample: 'https://example.com/zoe.mp3', description: 'Seductive and mysterious' },
    { id: 'v6', name: 'James', sample: 'https://example.com/james.mp3', description: 'Confident and commanding' }
  ];
  
  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    
    // Play sample
    audioPlayer.src = voice.sample;
    audioPlayer.play().catch(error => {
      console.error('Error playing audio:', error);
      // In production, would handle audio playback errors gracefully
    });
  };
  
  const handleConfirm = () => {
    if (!selectedVoice) {
      alert('Please select a voice');
      return;
    }
    
    // In production, would save voice preference to user profile
    console.log('Selected voice:', selectedVoice);
    
    // Move to chat interface
    setCurrentView('chat');
  };
  
  const handleBack = () => {
    // Stop any playing audio before going back
    audioPlayer.pause();
    setCurrentView('preferences');
  };
  
  const handleLogout = () => {
    // Stop any playing audio before logout
    audioPlayer.pause();
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Choose a Voice</h1>
        <p className="text-center text-gray-600 mb-6">Select a voice persona for your AI companion</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {voices.map(voice => (
            <div 
              key={voice.id}
              className={`voice-option p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200 ${selectedVoice?.id === voice.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleVoiceSelect(voice)}
            >
              <div className="font-medium">{voice.name}</div>
              <div className="text-xs text-gray-600">{voice.description}</div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleConfirm}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 ${!selectedVoice ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedVoice}
          >
            Confirm Selection
          </button>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between">
          <button 
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
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

export default VoiceSelectionPage; 