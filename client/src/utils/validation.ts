import config from '../config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    if (email.length < config.validation.email.minLength) {
      errors.push(`Email must be at least ${config.validation.email.minLength} characters`);
    }
    
    if (email.length > config.validation.email.maxLength) {
      errors.push(`Email must be less than ${config.validation.email.maxLength} characters`);
    }
    
    if (!config.validation.email.pattern.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < config.validation.password.minLength) {
      errors.push(`Password must be at least ${config.validation.password.minLength} characters`);
    }
    
    if (password.length > config.validation.password.maxLength) {
      errors.push(`Password must be less than ${config.validation.password.maxLength} characters`);
    }
    
    if (config.validation.password.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (config.validation.password.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (config.validation.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate device key
 */
export const validateDeviceKey = (deviceKey: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!deviceKey) {
    errors.push('Device key is required');
  } else {
    if (deviceKey.length < config.validation.deviceKey.minLength) {
      errors.push(`Device key must be at least ${config.validation.deviceKey.minLength} characters`);
    }
    
    if (deviceKey.length > config.validation.deviceKey.maxLength) {
      errors.push(`Device key must be less than ${config.validation.deviceKey.maxLength} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!value || value.trim() === '') {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate form data
 */
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult => {
  const allErrors: string[] = [];
  
  Object.keys(rules).forEach(field => {
    const validationResult = rules[field](data[field]);
    if (!validationResult.isValid) {
      allErrors.push(...validationResult.errors);
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
