import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseInputClasses = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2';
  
  // Error state
  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500 text-red-900' 
    : 'border-gray-300 focus:ring-blue-500';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon padding
  const paddingClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  // Combined classes
  const combinedClasses = `${baseInputClasses} ${errorClasses} ${widthClasses} ${paddingClasses} ${className}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={combinedClasses}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input; 