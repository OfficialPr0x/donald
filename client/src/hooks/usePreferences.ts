import { useCallback } from 'react';
import { useAppContext } from '../App';
import { Voice } from '../App';

export function usePreferences() {
  const { 
    preferences, 
    setPreferences, 
    selectedVoice,
    setSelectedVoice
  } = useAppContext();

  // Update preferences
  const updatePreferences = useCallback((
    ageGroup?: string,
    sex?: string,
    demeanor?: string
  ) => {
    const updates = {
      ...(ageGroup && { ageGroup }),
      ...(sex && { sex }),
      ...(demeanor && { demeanor })
    };

    if (Object.keys(updates).length > 0) {
      setPreferences(prev => ({
        ...prev,
        ...updates
      }));
    }
  }, [setPreferences]);

  // Validate preferences
  const validatePreferences = useCallback(() => {
    const { ageGroup, sex, demeanor } = preferences;
    return Boolean(ageGroup && sex && demeanor);
  }, [preferences]);

  // Select voice
  const selectVoice = useCallback((voice: Voice) => {
    setSelectedVoice(voice);
  }, [setSelectedVoice]);

  // Reset preferences
  const resetPreferences = useCallback(() => {
    setPreferences({
      ageGroup: '',
      sex: '',
      demeanor: ''
    });
    setSelectedVoice(null);
  }, [setPreferences, setSelectedVoice]);

  return {
    preferences,
    selectedVoice,
    updatePreferences,
    validatePreferences,
    selectVoice,
    resetPreferences,
    hasCompletedPreferences: validatePreferences(),
    hasSelectedVoice: selectedVoice !== null
  };
} 