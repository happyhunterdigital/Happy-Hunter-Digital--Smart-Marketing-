import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

// Mock Firebase Firestore
const mockOnSnapshot = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  onSnapshot: (...args: any[]) => mockOnSnapshot(...args),
  doc: (...args: any[]) => mockDoc(...args),
}));

// Mock firebaseConfig — always return the safe proxy so the component mounts
vi.mock('../firebaseConfig', () => ({
  db: new Proxy({}, { get: () => vi.fn() }),
}));

import { AIEntityEngine } from './AIEntityEngine';

describe('AIEntityEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no snapshot data', () => {
    // onSnapshot receives the query callback, we invoke it with no data
    mockOnSnapshot.mockImplementation((_q, next: any) => {
      next({ exists: () => false, data: () => ({}) });
      return vi.fn();
    });

    const { container } = render(<AIEntityEngine />);
    expect(container.firstChild).toBeNull();
  });

  it('renders JSON-LD script when snapshot has data', async () => {
    mockOnSnapshot.mockImplementation((_q, next: any) => {
      next({
        exists: () => true,
        data: () => ({ compiled_json_ld: '{"@context":"https://schema.org"}' }),
      });
      return vi.fn();
    });

    render(<AIEntityEngine />);

    await waitFor(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(script?.textContent).toContain('@context');
    });
  });

  it('does not crash when onSnapshot throws (safe proxy)', () => {
    mockOnSnapshot.mockImplementation(() => {
      throw new Error('Firestore not configured');
    });

    expect(() => render(<AIEntityEngine />)).not.toThrow();
  });

  it('logs warning but does not crash when error callback fires', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockOnSnapshot.mockImplementation((_q, _next: any, error: any) => {
      error(new Error('Permission denied'));
      return vi.fn();
    });

    expect(() => render(<AIEntityEngine />)).not.toThrow();
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('AIEntityEngine master schema listener notice:'),
      expect.anything()
    );

    consoleWarn.mockRestore();
  });

  it('returns a cleanup function from onSnapshot unsubscribe', () => {
    const unsubscribe = vi.fn();
    mockOnSnapshot.mockImplementation(() => unsubscribe);

    const { unmount } = render(<AIEntityEngine />);
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});