import config from '../config';

/**
 * Safe localStorage wrapper with error handling and type support
 */
class StorageManager {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkAvailability(): boolean {
    try {
      const test = 'storage_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  /**
   * Get item from localStorage with optional default value
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable) {
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  getAllKeys(): string[] {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }
}

// Create singleton instance
const storage = new StorageManager();

// Convenience methods using config keys
export const userStorage = {
  getUser: () => storage.get(config.storage.userKey),
  setUser: (user: any) => storage.set(config.storage.userKey, user),
  removeUser: () => storage.remove(config.storage.userKey),
};

export const authStorage = {
  getToken: () => storage.get<string>(config.storage.tokenKey),
  setToken: (token: string) => storage.set(config.storage.tokenKey, token),
  removeToken: () => storage.remove(config.storage.tokenKey),
};

export const preferencesStorage = {
  getPreferences: () => storage.get(config.storage.preferencesKey),
  setPreferences: (preferences: any) => storage.set(config.storage.preferencesKey, preferences),
  removePreferences: () => storage.remove(config.storage.preferencesKey),
};

export const deviceStorage = {
  getDeviceKey: () => storage.get<string>(config.storage.deviceKey),
  setDeviceKey: (key: string) => storage.set(config.storage.deviceKey, key),
  removeDeviceKey: () => storage.remove(config.storage.deviceKey),
};

export const voiceStorage = {
  getSelectedVoice: () => storage.get(config.storage.voiceKey),
  setSelectedVoice: (voice: any) => storage.set(config.storage.voiceKey, voice),
  removeSelectedVoice: () => storage.remove(config.storage.voiceKey),
};

export default storage;
