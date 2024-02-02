// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the fallback UI.
    console.error(e);
    return { hasError: true, errorMessage: e.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>エラーが発生しました。ページをリロードしてください。</h1>
          <div>{this.state.errorMessage}</div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
