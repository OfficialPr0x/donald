import React, { useState } from 'react';
import { View, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function RegisterPage({ setCurrentView }: Props) {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageConfirm, setAgeConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!ageConfirm) {
      alert('You must confirm you are 18+ to continue');
      return;
    }
    
    // In production, this would integrate with authentication service
    const newUser = { 
      email, 
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      active: false 
    };
    
    // Update global state and local storage
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Navigate to payment page
    setCurrentView('payment');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-start">
            <input 
              type="checkbox" 
              id="ageConfirm" 
              required 
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={ageConfirm}
              onChange={(e) => setAgeConfirm(e.target.checked)}
            />
            <label htmlFor="ageConfirm" className="ml-2 block text-sm text-gray-700">
              I confirm I am at least 18 years old
            </label>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Register
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" className="text-blue-600 hover:underline" onClick={() => setCurrentView('login')}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 