import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Something went wrong
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  An unexpected error occurred while loading this page.
                </p>
                {this.state.error && (
                  <details className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error details
                    </summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 text-sm rounded-[3px] transition-colors bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
