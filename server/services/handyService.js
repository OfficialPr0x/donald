const axios = require('axios');

/**
 * Handy API v2 implementation based on https://handyfeeling.com/api/handy-rest/v2/docs/spec.yaml
 * This implementation is compatible with devices running firmware v3 only.
 */
const HANDY_API_BASE = 'https://www.handyfeeling.com/api/handy-rest/v2';

class HandyService {
  /**
   * Check if the device is connected
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<boolean>} - Whether the device is connected
   */
  async isConnected(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/connected`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data && response.data.connected === true;
    } catch (error) {
      console.error('Error checking device connection:', error.message);
      return false;
    }
  }

  /**
   * Get device information
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Device information
   */
  async getInfo(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/info`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting device info:', error.message);
      throw new Error('Failed to get device information');
    }
  }

  /**
   * Get current device mode
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current device mode
   */
  async getMode(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/mode`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting device mode:', error.message);
      throw new Error('Failed to get device mode');
    }
  }

  /**
   * Set device mode
   * @param {string} connectionKey - Device connection key
   * @param {number} mode - Mode to set (0: HAMP, 1: HDSP, 2: HSSP, 3: MAINTENANCE)
   * @returns {Promise<Object>} - Result of mode change
   */
  async setMode(connectionKey, mode) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/mode`, 
        { mode },
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting device mode:', error.message);
      throw new Error('Failed to set device mode');
    }
  }

  /**
   * Get current slide settings
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current slide settings
   */
  async getSlideSettings(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/slide`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting slide settings:', error.message);
      throw new Error('Failed to get slide settings');
    }
  }

  /**
   * Set slide settings
   * @param {string} connectionKey - Device connection key
   * @param {Object} settings - Slide settings
   * @param {number} [settings.min] - Minimum position (0-100)
   * @param {number} [settings.max] - Maximum position (0-100)
   * @param {boolean} [settings.fixed] - Whether to maintain range size
   * @returns {Promise<Object>} - Result of slide settings update
   */
  async setSlideSettings(connectionKey, settings) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/slide`, 
        settings,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting slide settings:', error.message);
      throw new Error('Failed to set slide settings');
    }
  }

  /**
   * Get current absolute position
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current position in mm
   */
  async getPositionAbsolute(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/slide/position/absolute`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting absolute position:', error.message);
      throw new Error('Failed to get absolute position');
    }
  }

  /**
   * Set HAMP mode velocity
   * @param {string} connectionKey - Device connection key
   * @param {number} velocity - Velocity percentage (0-100)
   * @returns {Promise<Object>} - Result of velocity update
   */
  async setHampVelocity(connectionKey, velocity) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hamp/velocity`, 
        { velocity },
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting HAMP velocity:', error.message);
      throw new Error('Failed to set HAMP velocity');
    }
  }

  /**
   * Get HAMP mode settings
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current HAMP settings
   */
  async getHampSettings(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hamp`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HAMP settings:', error.message);
      throw new Error('Failed to get HAMP settings');
    }
  }

  /**
   * Set HAMP mode settings
   * @param {string} connectionKey - Device connection key
   * @param {Object} settings - HAMP settings
   * @param {number} settings.velocity - Velocity percentage (0-100)
   * @param {number} [settings.state] - HAMP state (0: Stopped, 1: Moving)
   * @returns {Promise<Object>} - Result of HAMP settings update
   */
  async setHampSettings(connectionKey, settings) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hamp`, 
        settings,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting HAMP settings:', error.message);
      throw new Error('Failed to set HAMP settings');
    }
  }

  /**
   * Start HAMP mode movement
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Result of start command
   */
  async startHamp(connectionKey) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hamp/start`, 
        {},
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting HAMP:', error.message);
      throw new Error('Failed to start HAMP mode');
    }
  }

  /**
   * Stop HAMP mode movement
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Result of stop command
   */
  async stopHamp(connectionKey) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hamp/stop`, 
        {},
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error stopping HAMP:', error.message);
      throw new Error('Failed to stop HAMP mode');
    }
  }

  /**
   * Get server time for synchronization
   * @returns {Promise<Object>} - Server time
   */
  async getServerTime() {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/servertime`);
      return response.data;
    } catch (error) {
      console.error('Error getting server time:', error.message);
      throw new Error('Failed to get server time');
    }
  }

  /**
   * Calculate client-server offset for synchronization
   * @param {number} sampleSize - Number of samples to take (30 recommended)
   * @returns {Promise<number>} - Client-server offset in milliseconds
   */
  async calculateClientServerOffset(sampleSize = 30) {
    let offsetAgg = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const sendTime = Date.now();
      const { serverTime } = await this.getServerTime();
      const receiveTime = Date.now();
      
      const rtd = receiveTime - sendTime; // Round trip delay
      const estimatedServerTime = serverTime + (rtd / 2);
      const offset = estimatedServerTime - receiveTime;
      
      offsetAgg += offset;
    }
    
    return offsetAgg / sampleSize;
  }

  /**
   * Estimate current server time using client-server offset
   * @param {number} csOffset - Client-server offset in milliseconds
   * @returns {number} - Estimated server time
   */
  estimateServerTime(csOffset) {
    return Date.now() + csOffset;
  }

  /**
   * Validate a connection key by checking if device is connected
   * @param {string} connectionKey - Device connection key to validate
   * @returns {Promise<boolean>} - Whether the key is valid
   */
  async validateKey(connectionKey) {
    try {
      // First check if device is connected
      const connected = await this.isConnected(connectionKey);
      if (!connected) return false;
      
      // Then check device info to verify firmware version
      const info = await this.getInfo(connectionKey);
      
      // Make sure device is using firmware v3+
      if (info && info.fwStatus !== undefined) {
        // fwStatus: 0 = UP_TO_DATE, 1 = UPDATE_AVAILABLE, 2 = UPDATE_REQUIRED
        return info.fwStatus !== 2; // If 2, it's a v2 device needing update
      }
      
      return false;
    } catch (error) {
      console.error('Error validating connection key:', error.message);
      return false;
    }
  }

  /**
   * Send command to device
   * @param {string} connectionKey - Device connection key
   * @param {string} command - Command to send
   * @param {Object} params - Command parameters
   * @returns {Promise<Object>} - Command result
   */
  async sendCommand(connectionKey, command, params = {}) {
    try {
      // First ensure device is connected
      const connected = await this.isConnected(connectionKey);
      if (!connected) {
        throw new Error('Device not connected');
      }

      // Execute command based on type
      switch (command) {
        case 'set_speed':
        case 'set_velocity': {
          // Ensure we're in HAMP mode
          await this.setMode(connectionKey, 0);
          return await this.setHampVelocity(connectionKey, params.velocity || 50);
        }
        
        case 'set_position': {
          // Set slide min/max to control position
          const position = params.position || 50;
          return await this.setSlideSettings(connectionKey, {
            min: position,
            max: position
          });
        }
        
        case 'set_range': {
          return await this.setSlideSettings(connectionKey, {
            min: params.min || 0,
            max: params.max || 100
          });
        }
        
        case 'start': {
          // Put in HAMP mode and start movement
          await this.setMode(connectionKey, 0);
          return await this.startHamp(connectionKey);
        }
        
        case 'stop': {
          // Stop movement in HAMP mode
          return await this.stopHamp(connectionKey);
        }
        
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`Error executing command ${command}:`, error.message);
      throw new Error(`Failed to execute command: ${error.message}`);
    }
  }
}

const handyService = new HandyService();

module.exports = { handy: handyService };