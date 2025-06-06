import React, { useState } from 'react';
import { View, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function PaymentPage({ setCurrentView }: Props) {
  const { user, setUser } = useAppContext();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, this would integrate with Stripe or another payment processor
    console.log('Processing payment with:', { cardNumber, expiry, cvc });
    
    // Update user subscription status
    if (user) {
      const updatedUser = { ...user, active: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // Navigate to device connection page
    setCurrentView('deviceConnect');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Complete Your Subscription</h1>
        <p className="text-center text-gray-600 mb-6">Unlock full access to Intimate AI</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Monthly Subscription</span>
            <span className="font-bold">$9.99/month</span>
          </div>
          <p className="text-sm text-gray-600">Unlimited chat sessions with AI companions</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input 
              type="text" 
              id="cardNumber" 
              placeholder="1234 5678 9012 3456" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input 
                type="text" 
                id="expiry" 
                placeholder="MM/YY" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input 
                type="text" 
                id="cvc" 
                placeholder="123" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Subscribe Now
          </button>
        </form>
        
        <p className="text-xs text-center mt-6 text-gray-500">
          Your payment is secure and processed via Stripe. You can cancel anytime.
        </p>
      </div>
    </div>
  );
}

export default PaymentPage; 