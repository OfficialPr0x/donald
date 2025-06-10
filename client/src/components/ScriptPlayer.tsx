import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import deviceService, { ScriptPlaybackState } from '../services/deviceService';
import Button from './Button';

interface ScriptPlayerProps {
  scriptUrl?: string;
  onError?: (error: Error) => void;
  className?: string;
}

const ScriptPlayer: React.FC<ScriptPlayerProps> = ({ 
  scriptUrl, 
  onError,
  className = ''
}) => {
  const { user } = useAuth();
  const [playbackState, setPlaybackState] = useState<ScriptPlaybackState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(scriptUrl || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fetch playback state
  const fetchPlaybackState = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const state = await deviceService.getScriptState(user.id);
      setPlaybackState(state);
      setIsPlaying(state.state === 1); // 1 = playing
      setIsLooping(state.loop || false);
      
      if (state.url) {
        setCurrentUrl(state.url);
      }
      
      // If we have playback position information
      if (state.position !== undefined && state.duration !== undefined) {
        setProgress(state.position);
        setDuration(state.duration);
      }
    } catch (err: any) {
      console.error('Error fetching playback state:', err);
      // Only set error if it's not a "device not in HSSP mode" error
      if (err.message && !err.message.includes('mode')) {
        setError(err.message);
        if (onError) onError(err);
      }
    }
  }, [user?.id, onError]);

  // Initialize component
  useEffect(() => {
    if (user?.id) {
      fetchPlaybackState();
      
      // Set up polling interval for playback state
      const interval = setInterval(() => {
        if (isPlaying) {
          fetchPlaybackState();
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id, fetchPlaybackState, isPlaying]);

  // Sync device time
  const syncTime = async () => {
    if (!user?.id) return;
    
    try {
      setIsSyncing(true);
      setError(null);
      
      // Calculate client-server offset with 30 samples
      await deviceService.calculateOffset(30);
      
      // Sync device time
      await deviceService.syncTime(user.id);
      
      setIsSyncing(false);
    } catch (err: any) {
      console.error('Error syncing time:', err);
      setError(err.message || 'Failed to sync time');
      setIsSyncing(false);
      if (onError) onError(err);
    }
  };

  // Play script
  const playScript = async () => {
    if (!user?.id) return;
    if (!currentUrl) {
      setError('Please enter a script URL');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the helper method that handles the entire setup and playback process
      await deviceService.playSynchronizedScript(user.id, currentUrl, {
        loop: isLooping,
        startTime: 0,
        syncSamples: 30,
        syncTimeout: 5000
      });
      
      setIsPlaying(true);
      setLoading(false);
      
      // Fetch updated state after a short delay
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (err: any) {
      console.error('Error playing script:', err);
      setError(err.message || 'Failed to play script');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  // Stop playback
  const stopPlayback = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await deviceService.stopScript(user.id);
      
      setIsPlaying(false);
      setLoading(false);
      
      // Fetch updated state after a short delay
      setTimeout(() => fetchPlaybackState(), 500);
    } catch (err: any) {
      console.error('Error stopping script:', err);
      setError(err.message || 'Failed to stop script');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  // Seek to position
  const seekToPosition = async (position: number) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await deviceService.seekScript(user.id, position);
      
      setProgress(position);
      setLoading(false);
    } catch (err: any) {
      console.error('Error seeking script:', err);
      setError(err.message || 'Failed to seek script');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  // Toggle loop setting
  const toggleLoop = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const newLoopState = !isLooping;
      await deviceService.setScriptLoop(user.id, newLoopState);
      
      setIsLooping(newLoopState);
      setLoading(false);
    } catch (err: any) {
      console.error('Error setting loop:', err);
      setError(err.message || 'Failed to set loop');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <h3 className="text-lg font-medium mb-4">Script Player</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Script URL
        </label>
        <div className="flex">
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="Enter script URL"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPlaying || loading}
          />
          <Button 
            onClick={syncTime}
            className={`rounded-l-none ${isSyncing ? 'bg-yellow-500' : 'bg-gray-500'}`}
            disabled={loading || isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </div>
      
      {duration > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500"
              style={{ width: `${(progress / duration) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2 mb-4">
        {!isPlaying ? (
          <Button
            onClick={playScript}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={loading || !currentUrl}
          >
            {loading ? 'Loading...' : 'Play'}
          </Button>
        ) : (
          <Button
            onClick={stopPlayback}
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Stop'}
          </Button>
        )}
        
        <Button
          onClick={toggleLoop}
          className={`w-16 ${isLooping ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 hover:bg-gray-600'}`}
          disabled={loading}
        >
          {isLooping ? 'Loop' : 'Once'}
        </Button>
      </div>
      
      {playbackState && (
        <div className="text-xs text-gray-600">
          <p><strong>State:</strong> {playbackState.state === 1 ? 'Playing' : 'Stopped'}</p>
          {playbackState.estimatedDuration && (
            <p><strong>Duration:</strong> {formatTime(playbackState.estimatedDuration / 1000)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptPlayer;