import React, { useState, useEffect, useRef } from 'react';
import { View, useAppContext } from '../App';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

type Props = {
  setCurrentView: (view: View) => void;
};

function ChatPage({ setCurrentView }: Props) {
  const { user, preferences, selectedVoice, setUser, deviceConnected } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(deviceConnected ? 'connected' : 'disconnected');
  const [strokeSpeed, setStrokeSpeed] = useState(50);
  const [strokePosition, setStrokePosition] = useState(50);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on first render
  useEffect(() => {
    setTimeout(() => {
      let welcomeMessage = "Hello! I'm excited to connect with you. How would you like to begin?";
      
      // Personalize message if preferences are set
      if (selectedVoice) {
        welcomeMessage = `Hello, I'm ${selectedVoice.name}. I'm excited to connect with you. How would you like to begin?`;
      }
      
      receiveMessage(welcomeMessage);
    }, 1000);
  }, [selectedVoice]);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      sender: 'user',
      text: messageInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    
    // Process message
    processMessage(messageInput);
  };

  const processMessage = (text: string) => {
    setIsProcessing(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Parse for intents - simplified version
      let response, action;
      
      if (text.toLowerCase().includes('edge') || text.toLowerCase().includes('tease')) {
        response = "I'll edge you slowly... building up the pleasure. Let me control your rhythm.";
        action = 'edge';
      } else if (text.toLowerCase().includes('faster') || text.toLowerCase().includes('speed up')) {
        response = "Going faster now, feeling the intensity build...";
        action = 'speed';
      } else if (text.toLowerCase().includes('slower') || text.toLowerCase().includes('gentle')) {
        response = "Slowing down, taking it nice and easy...";
        action = 'slow';
      } else if (text.toLowerCase().includes('stop')) {
        response = "Stopping now. Let me know when you want to continue.";
        action = 'stop';
      } else if (text.toLowerCase().includes('pause')) {
        response = "Pausing for a moment. Ready when you are.";
        action = 'pause';
      } else {
        response = "I'm here with you, enjoying our connection. Tell me what you desire.";
        action = 'default';
      }
      
      // Personalize response if preferences are set
      if (selectedVoice && preferences.demeanor) {
        // This would be more sophisticated in production with proper NLP
        if (preferences.demeanor === 'dominant' && action !== 'stop' && action !== 'pause') {
          response = response.replace("I'll", "I'm going to").replace("I'm here", "I'm in control");
        } else if (preferences.demeanor === 'submissive') {
          response = response.replace("I'll", "May I").replace("I'm here", "I'm yours");
        }
      }
      
      // Receive message and perform device action
      receiveMessage(response);
      performDeviceAction(action);
      
      setIsProcessing(false);
    }, 1500);
  };

  const receiveMessage = (text: string) => {
    const botMessage: Message = {
      sender: 'bot',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // In production, this would trigger text-to-speech playback
    console.log('Playing voice response:', text);
  };

  const performDeviceAction = (action: string) => {
    // Simulate device API calls
    console.log('Performing device action:', action);
    
    switch(action) {
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
  };

  const handleStrokeSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeSpeed(parseInt(e.target.value));
  };

  const handleStrokePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokePosition(parseInt(e.target.value));
    // Would send to device API in production
  };

  const handlePauseDevice = () => {
    setStrokeSpeed(0);
    console.log('Device paused');
  };

  const handleStopDevice = () => {
    setStrokeSpeed(0);
    console.log('Device stopped');
  };

  const handleVoiceInput = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice input is not supported in your browser');
      return;
    }
    
    setIsRecording(true);
    
    // Simulate voice recording (would use actual Web Audio API in production)
    setTimeout(() => {
      setIsRecording(false);
      const simulatedVoiceText = "This is a simulated voice message";
      setMessageInput(simulatedVoiceText);
    }, 3000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-bold text-lg">Intimate AI</h1>
          <div className="ml-3 flex items-center">
            <div className={`h-3 w-3 rounded-full ${deviceStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="ml-1 text-xs text-gray-600">{deviceStatus}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </header>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col bg-white md:border-r">
          <div className="chat-container flex flex-col p-4">
            <div className="chat-messages h-full overflow-y-auto mb-4" ref={chatMessagesRef}>
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} max-w-[80%] mb-2 p-3 rounded-lg animate-fade-in`}
                  style={{
                    backgroundColor: message.sender === 'user' ? '#e2f5fe' : '#f0f0f0',
                    marginLeft: message.sender === 'user' ? 'auto' : undefined,
                    marginRight: message.sender === 'bot' ? 'auto' : undefined,
                    borderBottomRightRadius: message.sender === 'user' ? '4px' : undefined,
                    borderBottomLeftRadius: message.sender === 'bot' ? '4px' : undefined
                  }}
                >
                  {message.text}
                </div>
              ))}
              
              {isProcessing && (
                <div 
                  className="message bot-message max-w-[80%] mb-2 p-3 rounded-lg"
                  style={{
                    backgroundColor: '#f0f0f0',
                    marginRight: 'auto',
                    borderBottomLeftRadius: '4px'
                  }}
                >
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>
            
            <form className="mt-auto flex items-center" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={isProcessing}
              />
              <button 
                type="button" 
                onClick={handleVoiceInput}
                className={`px-3 py-2 bg-gray-200 text-gray-700 border-t border-b border-r ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                disabled={isProcessing || !messageInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        {/* Device Controls */}
        <div className="bg-gray-50 p-4 md:w-72">
          <h2 className="font-medium text-lg mb-4">Device Controls</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={strokeSpeed} 
              onChange={handleStrokeSpeedChange}
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
              onChange={handleStrokePositionChange}
              className="slider w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Top</span>
              <span>{strokePosition}%</span>
              <span>Bottom</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={handlePauseDevice}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause
            </button>
            <button 
              onClick={handleStopDevice}
              className="flex items-center justify-center py-2 px-4 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="mb-1"><strong>Connected as:</strong> {selectedVoice?.name || 'AI Companion'}</p>
              <p><strong>Style:</strong> {preferences.demeanor || 'Default'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default ChatPage; 