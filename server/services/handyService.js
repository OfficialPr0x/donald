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

  // HDSP Mode (Handy Direct Streaming Protocol) endpoints

  /**
   * Get HDSP settings
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current HDSP settings
   */
  async getHdspSettings(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hdsp`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HDSP settings:', error.message);
      throw new Error('Failed to get HDSP settings');
    }
  }

  /**
   * Set HDSP command
   * @param {string} connectionKey - Device connection key
   * @param {Object} command - HDSP command
   * @param {number} command.position - Position (0-100)
   * @returns {Promise<Object>} - Result of command
   */
  async sendHdspCommand(connectionKey, command) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hdsp/command`, 
        command,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending HDSP command:', error.message);
      throw new Error('Failed to send HDSP command');
    }
  }

  // HSSP Mode (Handy Synced Stream Protocol) endpoints

  /**
   * Get HSSP settings
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Current HSSP settings
   */
  async getHsspSettings(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hssp`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSSP settings:', error.message);
      throw new Error('Failed to get HSSP settings');
    }
  }

  /**
   * Set HSSP setup
   * @param {string} connectionKey - Device connection key
   * @param {Object} setup - HSSP setup
   * @param {number} setup.timeout - Timeout in ms
   * @returns {Promise<Object>} - Result of setup
   */
  async setHsspSetup(connectionKey, setup) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hssp/setup`, 
        setup,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting HSSP setup:', error.message);
      throw new Error('Failed to set HSSP setup');
    }
  }

  /**
   * Play HSSP script
   * @param {string} connectionKey - Device connection key
   * @param {Object} playConfig - Play configuration
   * @param {string} playConfig.url - Script URL
   * @param {number} playConfig.serverTime - Current server time (Tcest)
   * @param {number} playConfig.startTime - Script start time
   * @param {boolean} [playConfig.loop] - Whether to loop the script
   * @returns {Promise<Object>} - Result of play command
   */
  async playHsspScript(connectionKey, playConfig) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hssp/play`, 
        playConfig,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error playing HSSP script:', error.message);
      throw new Error('Failed to play HSSP script');
    }
  }

  /**
   * Stop HSSP playback
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Result of stop command
   */
  async stopHssp(connectionKey) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hssp/stop`, 
        {},
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error stopping HSSP:', error.message);
      throw new Error('Failed to stop HSSP');
    }
  }

  /**
   * Seek HSSP playback to specific time
   * @param {string} connectionKey - Device connection key
   * @param {Object} seekConfig - Seek configuration
   * @param {number} seekConfig.serverTime - Current server time (Tcest)
   * @param {number} seekConfig.time - Time to seek to in script
   * @returns {Promise<Object>} - Result of seek command
   */
  async seekHssp(connectionKey, seekConfig) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hssp/seek`, 
        seekConfig,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error seeking HSSP:', error.message);
      throw new Error('Failed to seek HSSP');
    }
  }

  /**
   * Get HSSP playback state
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Playback state
   */
  async getHsspState(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hssp/state`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSSP state:', error.message);
      throw new Error('Failed to get HSSP state');
    }
  }

  /**
   * Get HSSP loop state
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Loop state
   */
  async getHsspLoop(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hssp/loop`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSSP loop state:', error.message);
      throw new Error('Failed to get HSSP loop state');
    }
  }

  /**
   * Set HSSP loop state
   * @param {string} connectionKey - Device connection key
   * @param {Object} loopConfig - Loop configuration
   * @param {boolean} loopConfig.loop - Whether to loop
   * @returns {Promise<Object>} - Result of loop command
   */
  async setHsspLoop(connectionKey, loopConfig) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hssp/loop`, 
        loopConfig,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting HSSP loop:', error.message);
      throw new Error('Failed to set HSSP loop');
    }
  }

  // HSTP (Handy Simple Timing Protocol) endpoints

  /**
   * Get HSTP status
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - HSTP status
   */
  async getHstpStatus(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hstp`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSTP status:', error.message);
      throw new Error('Failed to get HSTP status');
    }
  }

  /**
   * Get HSTP offset
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - HSTP offset
   */
  async getHstpOffset(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hstp/offset`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSTP offset:', error.message);
      throw new Error('Failed to get HSTP offset');
    }
  }

  /**
   * Set HSTP offset
   * @param {string} connectionKey - Device connection key
   * @param {Object} offsetConfig - Offset configuration
   * @param {number} offsetConfig.offset - Offset in ms
   * @returns {Promise<Object>} - Result of offset command
   */
  async setHstpOffset(connectionKey, offsetConfig) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hstp/offset`, 
        offsetConfig,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting HSTP offset:', error.message);
      throw new Error('Failed to set HSTP offset');
    }
  }

  /**
   * Perform HSTP time sync
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Result of sync command
   */
  async syncHstpTime(connectionKey) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hstp/time`, 
        {},
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error syncing HSTP time:', error.message);
      throw new Error('Failed to sync HSTP time');
    }
  }

  /**
   * Start HSTP sync process
   * @param {string} connectionKey - Device connection key
   * @param {Object} syncConfig - Sync configuration
   * @param {number} syncConfig.timeout - Timeout in ms
   * @returns {Promise<Object>} - Result of start sync command
   */
  async startHstpSync(connectionKey, syncConfig) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hstp/sync`, 
        syncConfig,
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting HSTP sync:', error.message);
      throw new Error('Failed to start HSTP sync');
    }
  }

  /**
   * Get HSTP sync status
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Sync status
   */
  async getHstpSyncStatus(connectionKey) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/hstp/sync`, {
        headers: { 'X-Connection-Key': connectionKey }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting HSTP sync status:', error.message);
      throw new Error('Failed to get HSTP sync status');
    }
  }

  /**
   * Stop HSTP sync process
   * @param {string} connectionKey - Device connection key
   * @returns {Promise<Object>} - Result of stop sync command
   */
  async stopHstpSync(connectionKey) {
    try {
      const response = await axios.put(`${HANDY_API_BASE}/hstp/stop`, 
        {},
        { headers: { 'X-Connection-Key': connectionKey } }
      );
      return response.data;
    } catch (error) {
      console.error('Error stopping HSTP sync:', error.message);
      throw new Error('Failed to stop HSTP sync');
    }
  }

  /**
   * Get latest OTA (Over-The-Air) firmware update information
   * @param {string} model - Device model
   * @param {string} branch - Firmware branch
   * @returns {Promise<Object>} - Latest firmware information
   */
  async getLatestFirmware(model, branch) {
    try {
      const response = await axios.get(`${HANDY_API_BASE}/ota/latest?model=${model}&branch=${branch}`);
      return response.data;
    } catch (error) {
      console.error('Error getting latest firmware:', error.message);
      throw new Error('Failed to get latest firmware information');
    }
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

        case 'play_script': {
          // Put in HSSP mode
          await this.setMode(connectionKey, 2);
          
          // First set up HSSP
          await this.setHsspSetup(connectionKey, {
            timeout: params.timeout || 5000
          });
          
          // Calculate client-server offset if not provided
          const csOffset = params.csOffset || await this.calculateClientServerOffset();
          
          // Estimate server time
          const serverTime = this.estimateServerTime(csOffset);
          
          // Play the script
          return await this.playHsspScript(connectionKey, {
            url: params.url,
            serverTime,
            startTime: params.startTime || 0,
            loop: params.loop || false
          });
        }
        
        case 'stop_script': {
          return await this.stopHssp(connectionKey);
        }
        
        case 'seek_script': {
          // Calculate client-server offset if not provided
          const csOffset = params.csOffset || await this.calculateClientServerOffset();
          
          // Estimate server time
          const serverTime = this.estimateServerTime(csOffset);
          
          return await this.seekHssp(connectionKey, {
            serverTime,
            time: params.time || 0
          });
        }
        
        case 'direct_position': {
          // Put in HDSP mode
          await this.setMode(connectionKey, 1);
          
          return await this.sendHdspCommand(connectionKey, {
            position: params.position || 50
          });
        }
        
        case 'sync_time': {
          return await this.syncHstpTime(connectionKey);
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