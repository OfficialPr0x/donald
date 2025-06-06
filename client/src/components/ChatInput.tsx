import React, { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  isProcessing?: boolean;
  isRecording?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onVoiceInput,
  isProcessing = false,
  isRecording = false,
  disabled = false,
  placeholder = "Type your message...",
  value,
  onChange,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState('');
  
  // Use either controlled (from parent) or uncontrolled (local) state
  const inputValue = value !== undefined ? value : localValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing || disabled) return;
    
    onSendMessage(inputValue);
    
    // Only clear local state if uncontrolled
    if (onChange === undefined) {
      setLocalValue('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        disabled={isProcessing || disabled}
        className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {onVoiceInput && (
        <button
          type="button"
          onClick={onVoiceInput}
          disabled={isProcessing || disabled}
          className={`px-3 py-2 bg-gray-200 text-gray-700 border-t border-b border-r ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      )}
      
      <button
        type="submit"
        disabled={isProcessing || disabled || !inputValue.trim()}
        className={`px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-200 ${(!inputValue.trim() || isProcessing || disabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput; 