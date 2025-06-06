import React, { useState, createContext, useContext } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import DeviceConnectPage from './pages/DeviceConnectPage';
import PreferencesPage from './pages/PreferencesPage';
import VoiceSelectionPage from './pages/VoiceSelectionPage';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';

export type View =
  | 'landing'
  | 'login'
  | 'register'
  | 'payment'
  | 'deviceConnect'
  | 'preferences'
  | 'voiceSelection'
  | 'chat';

export type User = {
  email: string;
  id: string;
  active: boolean;
};

export type Preferences = {
  ageGroup: string;
  sex: string;
  demeanor: string;
};

export type Voice = {
  id: string;
  name: string;
  sample: string;
  description: string;
};

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  deviceConnected: boolean;
  setDeviceConnected: (connected: boolean) => void;
  deviceKey: string;
  setDeviceKey: (key: string) => void;
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice | null) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deviceKey, setDeviceKey] = useState('');
  const [preferences, setPreferences] = useState<Preferences>({
    ageGroup: '',
    sex: '',
    demeanor: ''
  });
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  // Check for saved user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentView('deviceConnect');
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const contextValue: AppContextType = {
    user,
    setUser,
    deviceConnected,
    setDeviceConnected,
    deviceKey,
    setDeviceKey,
    preferences,
    setPreferences,
    selectedVoice,
    setSelectedVoice
  };

  const pageProps = { setCurrentView };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        {(() => {
          switch (currentView) {
            case 'login':
              return <LoginPage {...pageProps} />;
            case 'register':
              return <RegisterPage {...pageProps} />;
            case 'payment':
              return <PaymentPage {...pageProps} />;
            case 'deviceConnect':
              return <DeviceConnectPage {...pageProps} />;
            case 'preferences':
              return <PreferencesPage {...pageProps} />;
            case 'voiceSelection':
              return <VoiceSelectionPage {...pageProps} />;
            case 'chat':
              return <ChatPage {...pageProps} />;
            case 'landing':
            default:
              return <LandingPage {...pageProps} />;
          }
        })()}
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
