// Helper function to safely access environment variables
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key] || defaultValue;
  }
  
  // For build time environment variables in React
  const envValue = (window as any)[key] || defaultValue;
  return envValue;
};

// Get React environment variables safely
const getReactEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    // Access environment variables through the global object if available
    if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
      return (globalThis as any).process.env[key] || defaultValue;
    }
    
    // Fallback to direct access
    const envVars = {
      'REACT_APP_API_URL': 'http://localhost:4000/api',
      'REACT_APP_SUPABASE_URL': '',
      'REACT_APP_SUPABASE_KEY': '',
      'REACT_APP_STRIPE_PUBLISHABLE_KEY': '',
      'REACT_APP_VENICE_API_URL': 'https://api.venice.ai/v1',
      'REACT_APP_HANDY_API_URL': 'https://www.handyfeeling.com/api/v1',
      'REACT_APP_ENABLE_ANALYTICS': 'false',
      'REACT_APP_ENABLE_ERROR_REPORTING': 'true',
      'NODE_ENV': 'development'
    };
    
    return (envVars as any)[key] || defaultValue;
  } catch (error) {
    console.warn(`Error accessing environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Environment-based configuration
const config = {
  // API Configuration
  apiUrl: getReactEnvVar('REACT_APP_API_URL', 'http://localhost:4000/api'),
  
  // Supabase Configuration
  supabase: {
    url: getReactEnvVar('REACT_APP_SUPABASE_URL', ''),
    key: getReactEnvVar('REACT_APP_SUPABASE_KEY', ''),
  },
  
  // Stripe Configuration
  stripe: {
    publishableKey: getReactEnvVar('REACT_APP_STRIPE_PUBLISHABLE_KEY', ''),
  },
  
  // Venice AI Configuration
  venice: {
    apiUrl: getReactEnvVar('REACT_APP_VENICE_API_URL', 'https://api.venice.ai/v1'),
  },
  
  // Handy Device Configuration
  handy: {
    apiUrl: getReactEnvVar('REACT_APP_HANDY_API_URL', 'https://www.handyfeeling.com/api/v1'),
  },
  
  // Feature Flags
  features: {
    enableAnalytics: getReactEnvVar('REACT_APP_ENABLE_ANALYTICS') === 'true',
    enableErrorReporting: getReactEnvVar('REACT_APP_ENABLE_ERROR_REPORTING') === 'true',
  },
  
  // App Configuration
  app: {
    name: 'Intimate AI',
    version: '1.0.0',
    environment: getReactEnvVar('NODE_ENV', 'development'),
    isDevelopment: getReactEnvVar('NODE_ENV', 'development') === 'development',
    isProduction: getReactEnvVar('NODE_ENV', 'development') === 'production',
  },
  
  // Storage Keys
  storage: {
    userKey: 'user',
    tokenKey: 'auth_token',
    preferencesKey: 'user_preferences',
    deviceKey: 'device_key',
    voiceKey: 'selected_voice',
  },
  
  // API Timeouts (in milliseconds)
  timeouts: {
    default: 30000, // 30 seconds
    upload: 120000, // 2 minutes
    chat: 60000, // 1 minute
  },
  
  // Rate Limiting
  rateLimits: {
    chatMessages: 10, // messages per minute
    apiCalls: 100, // calls per minute
  },
  
  // Validation Rules
  validation: {
    email: {
      minLength: 5,
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true,
    },
    deviceKey: {
      minLength: 10,
      maxLength: 50,
    },
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_KEY',
    'REACT_APP_STRIPE_PUBLISHABLE_KEY',
  ];
  
  const missing = required.filter(key => !getReactEnvVar(key));
  
  if (missing.length > 0 && config.app.isProduction) {
    console.error('Missing required environment variables:', missing);
  }
  
  if (missing.length > 0 && config.app.isDevelopment) {
    console.warn('Missing environment variables (development):', missing);
  }
};

// Run validation
validateConfig();

export default config;
