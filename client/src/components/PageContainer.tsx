import React from 'react';
import Card from './Card';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  className?: string;
  cardClassName?: string;
  footer?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'md',
  centered = true,
  className = '',
  cardClassName = '',
  footer
}) => {
  const maxWidthClass = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full'
  }[maxWidth];

  return (
    <div className={`flex flex-col ${centered ? 'items-center justify-center' : ''} min-h-screen bg-gray-100 p-4 ${className}`}>
      <div className={`w-full ${maxWidthClass}`}>
        <Card
          title={title}
          subtitle={subtitle}
          footer={footer}
          className={cardClassName}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default PageContainer; 