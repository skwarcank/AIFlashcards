"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 text-center text-white">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <Button onClick={this.handleReset}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
