import apiService from './api';

/**
 * Interface for device information
 */
export interface DeviceInfo {
  hwVersion: string;
  fwVersion: string;
  fwStatus: number;
  model: string;
  branch: string;
  [key: string]: any;
}

/**
 * Interface for device status
 */
export interface DeviceStatus {
  connected: boolean;
  deviceInfo?: DeviceInfo;
  mode?: {
    mode: number;
    name: string;
  };
  slide?: {
    min: number;
    max: number;
    limitMin: number;
    limitMax: number;
    limitDist: number;
  };
  message?: string;
}

/**
 * Interface for firmware status
 */
export interface FirmwareStatus {
  firmwareStatus: number;
  updateRequired: boolean;
  updateMessage: string;
  currentVersion: string;
}

/**
 * Interface for script playback state
 */
export interface ScriptPlaybackState {
  state: number;
  url?: string;
  loop?: boolean;
  startTime?: number;
  [key: string]: any;
}

/**
 * Interface for HSTP status
 */
export interface HstpStatus {
  enabled: boolean;
  syncRequired: boolean;
  syncInProgress: boolean;
  estimatedServerTime?: number;
  [key: string]: any;
}

/**
 * Interface for time synchronization
 */
export interface TimeSync {
  serverTime: number;
}

/**
 * Service to handle Handy device operations
 */
class DeviceService {
  // Client-server offset for time synchronization
  private csOffset: number = 0;

  /**
   * Set client-server offset
   * @param offset Offset in milliseconds
   */
  setClientServerOffset(offset: number): void {
    this.csOffset = offset;
  }

  /**
   * Get client-server offset
   * @returns Offset in milliseconds
   */
  getClientServerOffset(): number {
    return this.csOffset;
  }

  /**
   * Estimate server time using client-server offset
   * @returns Estimated server time
   */
  estimateServerTime(): number {
    return Date.now() + this.csOffset;
  }

  /**
   * Pair a device with a user account
   * @param userId User ID
   * @param connectionKey Handy connection key
   */
  async pairDevice(userId: string, connectionKey: string): Promise<{ message: string; deviceInfo: DeviceInfo }> {
    return await apiService.post('/device/pair', { userId, connectionKey });
  }

  /**
   * Get device status
   * @param userId User ID
   */
  async getStatus(userId: string): Promise<DeviceStatus> {
    return await apiService.get(`/device/status?userId=${userId}`);
  }

  /**
   * Check firmware status
   * @param userId User ID
   */
  async checkFirmware(userId: string): Promise<FirmwareStatus> {
    return await apiService.get(`/device/firmware?userId=${userId}`);
  }

  /**
   * Set device velocity (speed)
   * @param userId User ID
   * @param velocity Velocity value (0-100)
   */
  async setVelocity(userId: string, velocity: number): Promise<any> {
    return await apiService.post('/device/velocity', { userId, velocity });
  }

  /**
   * Set slide min and max values
   * @param userId User ID
   * @param min Minimum position (0-100)
   * @param max Maximum position (0-100)
   * @param fixed Whether to maintain range size
   */
  async setSlideSettings(userId: string, min?: number, max?: number, fixed?: boolean): Promise<any> {
    return await apiService.post('/device/slide', { userId, min, max, fixed });
  }

  /**
   * Set stroke position
   * @param userId User ID
   * @param position Position value (0-100)
   */
  async setPosition(userId: string, position: number): Promise<any> {
    return await apiService.post('/device/control', { 
      userId, 
      command: 'set_position', 
      params: { position } 
    });
  }

  /**
   * Start device movement
   * @param userId User ID
   * @param velocity Optional velocity to set (0-100)
   */
  async startDevice(userId: string, velocity?: number): Promise<any> {
    return await apiService.post('/device/start', { userId, velocity });
  }

  /**
   * Stop device movement
   * @param userId User ID
   */
  async stopDevice(userId: string): Promise<any> {
    return await apiService.post('/device/stop', { userId });
  }

  /**
   * Set device mode
   * @param userId User ID
   * @param mode Mode to set (0: HAMP, 1: HDSP, 2: HSSP, 3: MAINTENANCE)
   */
  async setDeviceMode(userId: string, mode: number): Promise<any> {
    return await apiService.post('/device/mode', { userId, mode });
  }

  /**
   * Get server time for synchronization
   */
  async getServerTime(): Promise<TimeSync> {
    return await apiService.get('/device/servertime');
  }

  /**
   * Calculate client-server offset for synchronization
   * @param sampleSize Number of samples to take (default: 30)
   */
  async calculateOffset(sampleSize: number = 30): Promise<{ offset: number }> {
    const result = await apiService.get(`/device/offset?sampleSize=${sampleSize}`);
    // Store the offset for future use
    this.setClientServerOffset(result.offset);
    return result;
  }

  /**
   * Set up HSSP for script playback
   * @param userId User ID
   * @param timeout Timeout in milliseconds
   */
  async setupHssp(userId: string, timeout?: number): Promise<any> {
    return await apiService.post('/device/hssp/setup', { userId, timeout });
  }

  /**
   * Play a script with HSSP
   * @param userId User ID
   * @param url Script URL
   * @param startTime Script start time
   * @param loop Whether to loop the script
   */
  async playScript(userId: string, url: string, startTime: number = 0, loop: boolean = false): Promise<any> {
    // If we don't have an offset yet, calculate one
    if (this.csOffset === 0) {
      await this.calculateOffset();
    }
    
    return await apiService.post('/device/hssp/play', { 
      userId, 
      url, 
      startTime, 
      loop, 
      csOffset: this.csOffset 
    });
  }

  /**
   * Stop script playback
   * @param userId User ID
   */
  async stopScript(userId: string): Promise<any> {
    return await apiService.post('/device/hssp/stop', { userId });
  }

  /**
   * Seek to position in script
   * @param userId User ID
   * @param time Time to seek to in script
   */
  async seekScript(userId: string, time: number): Promise<any> {
    return await apiService.post('/device/hssp/seek', { 
      userId, 
      time, 
      csOffset: this.csOffset 
    });
  }

  /**
   * Get script playback state
   * @param userId User ID
   */
  async getScriptState(userId: string): Promise<ScriptPlaybackState> {
    return await apiService.get(`/device/hssp/state?userId=${userId}`);
  }

  /**
   * Set script loop state
   * @param userId User ID
   * @param loop Whether to loop the script
   */
  async setScriptLoop(userId: string, loop: boolean): Promise<any> {
    return await apiService.post('/device/hssp/loop', { userId, loop });
  }

  /**
   * Send direct position command (HDSP mode)
   * @param userId User ID
   * @param position Position (0-100)
   */
  async sendDirectPosition(userId: string, position: number): Promise<any> {
    return await apiService.post('/device/hdsp/position', { userId, position });
  }

  /**
   * Get HSTP status
   * @param userId User ID
   */
  async getHstpStatus(userId: string): Promise<HstpStatus> {
    return await apiService.get(`/device/hstp?userId=${userId}`);
  }

  /**
   * Sync device time
   * @param userId User ID
   */
  async syncTime(userId: string): Promise<any> {
    return await apiService.post('/device/hstp/time', { userId });
  }

  /**
   * Set HSTP offset
   * @param userId User ID
   * @param offset Offset in milliseconds
   */
  async setHstpOffset(userId: string, offset: number): Promise<any> {
    return await apiService.post('/device/hstp/offset', { userId, offset });
  }

  /**
   * Start HSTP sync process
   * @param userId User ID
   * @param timeout Timeout in milliseconds
   */
  async startHstpSync(userId: string, timeout?: number): Promise<any> {
    return await apiService.post('/device/hstp/sync', { userId, timeout });
  }

  /**
   * Get latest firmware information
   * @param model Device model
   * @param branch Firmware branch
   */
  async getLatestFirmware(model: string, branch: string): Promise<any> {
    return await apiService.get(`/device/ota/latest?model=${model}&branch=${branch}`);
  }

  /**
   * Execute a pattern using predefined commands
   * @param userId User ID
   * @param pattern Pattern name
   * @param params Additional parameters
   */
  async executePattern(
    userId: string, 
    pattern: 'edge' | 'speed' | 'slow' | 'default', 
    params?: any
  ): Promise<any> {
    switch (pattern) {
      case 'edge':
        // Implement edging pattern
        await this.setVelocity(userId, 30);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.setVelocity(userId, 70);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.stopDevice(userId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await this.startDevice(userId, 50);
        
      case 'speed':
        // Get current status to determine current velocity
        const status = await this.getStatus(userId);
        if (!status.connected) throw new Error('Device not connected');
        // Increase velocity by 20%
        const currentVelocity = params?.currentVelocity || 50;
        return await this.setVelocity(userId, Math.min(currentVelocity + 20, 100));
        
      case 'slow':
        // Decrease velocity by 20%
        const velocity = params?.currentVelocity || 50;
        return await this.setVelocity(userId, Math.max(velocity - 20, 10));
        
      case 'default':
        // Set default settings
        await this.setSlideSettings(userId, 0, 100);
        await this.setVelocity(userId, 50);
        return await this.startDevice(userId);
        
      default:
        throw new Error(`Unknown pattern: ${pattern}`);
    }
  }

  /**
   * Play a synchronized script with time sync
   * This is a helper method that handles the full HSSP setup and playback process
   * @param userId User ID
   * @param scriptUrl URL of the script to play
   * @param options Additional options
   */
  async playSynchronizedScript(
    userId: string, 
    scriptUrl: string, 
    options: { 
      startTime?: number; 
      loop?: boolean; 
      syncTimeout?: number;
      syncSamples?: number;
    } = {}
  ): Promise<any> {
    try {
      // 1. Calculate client-server offset for accurate timing
      await this.calculateOffset(options.syncSamples || 30);
      
      // 2. Switch to HSSP mode
      await this.setDeviceMode(userId, 2);
      
      // 3. Setup HSSP with timeout
      await this.setupHssp(userId, options.syncTimeout || 5000);
      
      // 4. Play the script
      return await this.playScript(
        userId, 
        scriptUrl, 
        options.startTime || 0,
        options.loop || false
      );
    } catch (error) {
      console.error('Error playing synchronized script:', error);
      throw error;
    }
  }
}

export default new DeviceService(); 