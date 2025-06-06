import React from 'react';
import { View } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function LandingPage({ setCurrentView }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-2">Intimate AI</h1>
        <p className="text-center text-gray-600 mb-8">Connect with your Handy device for an AI-driven experience</p>
        <div className="space-y-4">
          <button
            onClick={() => setCurrentView('login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Register
          </button>
        </div>
        <p className="text-xs text-center mt-8 text-gray-500">
          By using this app, you confirm you are 18+ years of age and agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

export default LandingPage; 