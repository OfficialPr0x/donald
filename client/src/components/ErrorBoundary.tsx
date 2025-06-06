import * as React from 'react';
// Add this for process.env
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

// Define our interfaces
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  eventId: string | null;
}

// Create a traditional class component for the error boundary
// Use Component from React namespace to ensure TypeScript recognizes it correctly
class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  resetTimeoutId: number | null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.resetTimeoutId = null;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const eventId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    this.setState({ errorInfo, eventId });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary - Event ID: ${eventId}`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    } else {
      console.error(`Error caught by boundary (${eventId}):`, error.message);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset on children change if enabled
    if (hasError && prevProps.children !== this.props.children && resetOnPropsChange) {
      this.resetErrorBoundary();
    }

    // Reset on key change if enabled
    if (hasError && resetKeys) {
      const prevResetKeys = prevProps.resetKeys || [];
      const hasResetKeyChanged = resetKeys.some(
        (resetKey, idx) => prevResetKeys[idx] !== resetKey
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  renderErrorDetails = (): React.ReactNode => {
    const { error, errorInfo, eventId } = this.state;

    if (process.env.NODE_ENV !== 'development' || !error) {
      return null;
    }

    return (
      <details className="mt-6 text-left">
        <summary className="cursor-pointer text-sm text-gray-500 mb-3 hover:text-gray-700">
          🔍 Error Details (Development Only)
        </summary>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          {eventId && (
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Event ID:</h4>
              <code className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded break-all">
                {eventId}
              </code>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-red-800 mb-1">Error Message:</h4>
            <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
          {error.stack && (
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Stack Trace:</h4>
              <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          )}
          {errorInfo?.componentStack && (
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Component Stack:</h4>
              <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  render(): React.ReactNode {
    const { children, fallback } = this.props;
    const { hasError, eventId } = this.state;

    if (!hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default error UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
          </p>

          {eventId && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Error ID:</p>
              <code className="text-sm font-mono text-gray-700 break-all">{eventId}</code>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={this.resetErrorBoundary}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
            >
              Try Again
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                type="button"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                type="button"
              >
                Reload Page
              </button>
            </div>
          </div>

          {this.renderErrorDetails()}
        </div>
      </div>
    );
  }
}

// Export the error boundary component as default
export default ErrorBoundaryComponent;

// Helper hook for error boundary reset
export const useErrorBoundaryReset = (): { resetKey: number; reset: () => void } => {
  const [resetKey, setResetKey] = React.useState<number>(0);
  
  const reset = React.useCallback((): void => {
    setResetKey((prev: number) => prev + 1);
  }, []);

  return { resetKey, reset };
};

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = (props: P): React.ReactElement => (
    <ErrorBoundaryComponent {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryComponent>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized error boundaries
export const PageErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundaryComponent
    resetOnPropsChange={true}
    onError={(error: Error, errorInfo: React.ErrorInfo): void => {
      console.error('Page-level error:', error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundaryComponent>
);

export const ComponentErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  componentName?: string;
}> = ({ children, componentName }) => (
  <ErrorBoundaryComponent
    isolate={true}
    fallback={
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
        <p className="text-red-800 text-sm">
          {componentName 
            ? `Failed to load ${componentName}. Please try refreshing the page.`
            : 'Failed to load component. Please try refreshing the page.'
          }
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundaryComponent>
);

// Async boundary for handling async component errors
export const AsyncErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ErrorBoundaryComponent
    resetOnPropsChange={true}
    fallback={fallback || (
      <div className="flex items-center justify-center p-8" role="alert">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-800 font-medium">Failed to load content</p>
          <p className="text-red-600 text-sm mt-1">Please try again</p>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundaryComponent>
);
