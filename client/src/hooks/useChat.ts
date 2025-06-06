import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../App';
import { useDevice } from './useDevice';

export type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

export function useChat() {
  const { preferences, selectedVoice } = useAppContext();
  const { executePattern } = useDevice();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToBottom = useCallback(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    
    // Process message
    processMessage(text);
  }, [isProcessing]);

  const processMessage = useCallback((text: string) => {
    setIsProcessing(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Parse for intents - simplified version
      let response, action: 'edge' | 'speed' | 'slow' | 'stop' | 'pause' | 'default';
      
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
      executePattern(action);
      
      setIsProcessing(false);
    }, 1500);
  }, [selectedVoice, preferences, executePattern]);

  const receiveMessage = useCallback((text: string) => {
    const botMessage: Message = {
      sender: 'bot',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // In production, this would trigger text-to-speech playback
    console.log('Playing voice response:', text);
  }, []);

  const startVoiceInput = useCallback(() => {
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
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    messageInput,
    isProcessing,
    isRecording,
    chatMessagesRef,
    setMessageInput,
    sendMessage,
    receiveMessage,
    startVoiceInput,
    clearChat,
    scrollToBottom
  };
} 