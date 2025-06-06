import React from 'react';
import { View, useAppContext } from '../App';

type Props = {
  setCurrentView: (view: View) => void;
};

function PreferencesPage({ setCurrentView }: Props) {
  const { preferences, setPreferences, setUser } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { ageGroup, sex, demeanor } = preferences;
    
    if (!ageGroup || !sex || !demeanor) {
      alert('Please select all preferences');
      return;
    }
    
    // In production, would save preferences to user profile
    console.log('Saving preferences:', preferences);
    
    // Move to voice selection
    setCurrentView('voiceSelection');
  };

  const handleBack = () => {
    setCurrentView('deviceConnect');
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('landing');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Your Preferences</h1>
        <p className="text-center text-gray-600 mb-6">Help us personalize your experience</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="ageGroup" 
                  value="18-25" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.ageGroup === '18-25'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">18-25</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="ageGroup" 
                  value="26-35" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.ageGroup === '26-35'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">26-35</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="ageGroup" 
                  value="36-45" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.ageGroup === '36-45'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">36-45</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="ageGroup" 
                  value="46+" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.ageGroup === '46+'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">46+</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="sex" 
                  value="male" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.sex === 'male'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Male</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="sex" 
                  value="female" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.sex === 'female'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Female</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="sex" 
                  value="non-binary" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.sex === 'non-binary'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Non-binary</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Demeanor</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="demeanor" 
                  value="shy" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.demeanor === 'shy'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Shy</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="demeanor" 
                  value="dominant" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.demeanor === 'dominant'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Dominant</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="demeanor" 
                  value="submissive" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.demeanor === 'submissive'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Submissive</span>
              </label>
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="demeanor" 
                  value="playful" 
                  className="h-4 w-4 text-blue-600"
                  checked={preferences.demeanor === 'playful'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm">Playful</span>
              </label>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Continue
          </button>
        </form>
        
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

export default PreferencesPage; 