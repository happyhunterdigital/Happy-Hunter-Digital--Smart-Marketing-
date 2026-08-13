import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowComponent: React.FC = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">All good</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('shows reload and homepage buttons in fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    );
    expect(screen.getByRole('link', { name: /go to homepage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('calls console.error with error info on throw', async () => {
    render(
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    );
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});