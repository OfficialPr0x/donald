import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error)
    );
  }

  /**
   * Set the authentication token for API requests
   */
  setAuthToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    this.token = null;
  }

  /**
   * Handle API errors with custom error messages
   */
  private handleApiError(error: AxiosError): Promise<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const data = error.response.data as any;
      errorMessage = data.message || `Error ${error.response.status}: ${error.response.statusText}`;

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        this.clearAuthToken();
        // Trigger auth error event for the app to handle
        window.dispatchEvent(new CustomEvent('auth-error', { detail: 'Session expired' }));
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please check your connection.';
    }

    // Log the error for debugging
    console.error('API Error:', errorMessage, error);

    // Return a rejected promise with the error
    return Promise.reject({
      message: errorMessage,
      originalError: error,
    });
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;
