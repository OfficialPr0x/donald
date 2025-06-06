import React from 'react';
import { Message as MessageType } from '../hooks/useChat';

interface MessageProps {
  message: MessageType;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ message, className = '' }) => {
  const isUser = message.sender === 'user';
  
  // Base classes
  const baseClasses = 'max-w-[80%] mb-2 p-3 rounded-lg animate-fade-in';
  
  // Sender-specific classes
  const senderClasses = isUser
    ? 'user-message bg-blue-100 text-blue-900 ml-auto rounded-br-sm'
    : 'bot-message bg-gray-100 text-gray-900 mr-auto rounded-bl-sm';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${senderClasses} ${className}`;
  
  return (
    <div className={combinedClasses}>
      {message.text}
    </div>
  );
};

// Define keyframes for fade-in animation
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-in-out;
    }
  `}</style>
);

// Export both the component and the animation styles
export { Message, AnimationStyles };
export default Message; 