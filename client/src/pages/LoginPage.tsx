import React, { useState } from 'react';
import { View, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function LoginPage({ setCurrentView }: Props) {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate login - in production would use Firebase Auth
    const newUser = { 
      email, 
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      active: true 
    };
    
    // Update global state and local storage
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Navigate to device connection
    setCurrentView('deviceConnect');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
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
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button type="button" className="text-blue-600 hover:underline" onClick={() => setCurrentView('register')}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 