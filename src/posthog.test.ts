import { describe, it, expect, vi, beforeEach } from 'vitest';

const posthogMock = {
  init: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  capture: vi.fn(),
  debug: vi.fn(),
  on: vi.fn(),
};

vi.mock('posthog-js', () => ({
  __esModule: true,
  default: posthogMock,
}));

async function loadModule() {
  vi.resetModules();
  return import('./posthog');
}

describe('posthog.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not call posthog.init when VITE_POSTHOG_KEY is missing (CI-safe)', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    await loadModule();
    expect(posthogMock.init).not.toHaveBeenCalled();
  });

  it('calls posthog.init with api_host when a key is present', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    vi.stubEnv('VITE_POSTHOG_HOST', 'https://custom.posthog.com');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    await loadModule();
    expect(posthogMock.init).toHaveBeenCalledWith(
      'ph_test_key_123',
      expect.objectContaining({ api_host: 'https://custom.posthog.com' })
    );
  });

  it('skips init for automated browsers even when a key is present', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    Object.defineProperty(window.navigator, 'webdriver', { value: true, configurable: true });

    await loadModule();
    expect(posthogMock.init).not.toHaveBeenCalled();
  });

  it('Telemetry.identifyEntity identifies the user when a key is present', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    const { Telemetry } = await loadModule();
    Telemetry.identifyEntity('uid-1', 'test@test.com', 'Test User');

    expect(posthogMock.identify).toHaveBeenCalledWith('uid-1', { email: 'test@test.com', name: 'Test User' });
  });

  it('Telemetry.disconnectEntity calls posthog.reset', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    const { Telemetry } = await loadModule();
    Telemetry.disconnectEntity();
    expect(posthogMock.reset).toHaveBeenCalled();
  });

  it('Telemetry.capture events fire with correct payloads', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    const { Telemetry } = await loadModule();

    Telemetry.visualAuditTriggered('Happy Hunter Digital');
    expect(posthogMock.capture).toHaveBeenCalledWith('visual_audit_triggered', { business: 'Happy Hunter Digital' });

    Telemetry.serviceRequested('Modern Website', 'example.co.za');
    expect(posthogMock.capture).toHaveBeenCalledWith('service_requested', { service: 'Modern Website', website: 'example.co.za' });

    Telemetry.taskDeployed('Site Launch', 'high', 'Thabo');
    expect(posthogMock.capture).toHaveBeenCalledWith('workspace_task_deployed', { title: 'Site Launch', priority: 'high', assignee: 'Thabo' });
  });

  it('Telemetry methods never throw, even when posthog errors internally', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'ph_test_key_123');
    Object.defineProperty(window.navigator, 'webdriver', { value: undefined, configurable: true });

    posthogMock.identify.mockImplementation(() => { throw new Error('boom'); });
    posthogMock.capture.mockImplementation(() => { throw new Error('boom'); });
    posthogMock.reset.mockImplementation(() => { throw new Error('boom'); });

    const { Telemetry } = await loadModule();

    expect(() => Telemetry.identifyEntity('uid-1', 'a@b.com', 'A')).not.toThrow();
    expect(() => Telemetry.serviceRequested('Audit', 'x.com')).not.toThrow();
    expect(() => Telemetry.disconnectEntity()).not.toThrow();
  });
});