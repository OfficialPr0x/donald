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
 * Service to handle Handy device operations
 */
class DeviceService {
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
}

export default new DeviceService(); 