import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  contentClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  footerClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4">
          {title && (
            <h3 className={`text-xl font-bold ${titleClassName}`}>{title}</h3>
          )}
          {subtitle && (
            <p className={`text-gray-600 ${subtitleClassName}`}>{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={`px-6 py-4 ${contentClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 