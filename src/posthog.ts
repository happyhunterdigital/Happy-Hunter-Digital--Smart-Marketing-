import posthog from 'posthog-js';
import { hasConsent, onConsentChange } from './lib/consent';

// Skip analytics entirely when running under a headless/automated browser
// (this is what the build-time prerender step uses) so every CI build
// doesn't register as synthetic traffic in real analytics.
const isAutomatedBrowser = typeof navigator !== 'undefined' && navigator.webdriver === true;
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

let initialized = false;

/**
 * PostHog is initialised only after the visitor accepts the cookie banner.
 * Nothing is sent, and no vendor request is made, before that point.
 */
function initPostHog(): void {
  if (initialized || isAutomatedBrowser || !posthogKey || !hasConsent()) return;
  try {
    posthog.init(posthogKey, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      loaded: (ph) => {
        if (import.meta.env.DEV) ph.debug(); // Helps with debugging locally
      },
      autocapture: true, // Automatically tracks button clicks and page views
      capture_pageview: false // We will handle this manually in React Router
    });
    initialized = true;
  } catch (err) {
    console.warn("PostHog initialization notice:", err);
  }
}

if (typeof window !== 'undefined') {
  initPostHog();
  onConsentChange((choice) => {
    if (choice === 'accepted') {
      initPostHog();
      return;
    }
    if (choice === 'declined' && initialized) {
      try {
        posthog.reset();
        posthog.opt_out_capturing();
      } catch (e) {
        void e;
      }
    }
  });
}

const canTrack = () => initialized && hasConsent();

export const Telemetry = {
  // Bind Firebase Auth to PostHog
  identifyEntity: (uid: string, email: string, name: string) => {
    try {
      if (canTrack()) posthog.identify(uid, { email, name });
    } catch (e) { void e; }
  },

  // Clear identity on logout
  disconnectEntity: () => {
    try {
      if (canTrack()) posthog.reset();
    } catch (e) { void e; }
  },

  // Custom Event: Lead started the health check from the exit-intent popup
  healthCheckStarted: () => {
    try {
      if (canTrack()) posthog.capture('health_check_started');
    } catch (e) { void e; }
  },

  // Custom Event: When someone uploads an image for the Gemini Extension
  visualAuditTriggered: (targetBusiness: string) => {
    try {
      if (canTrack()) posthog.capture('visual_audit_triggered', { business: targetBusiness });
    } catch (e) { void e; }
  },

  // Custom Event: Workspace Activity
  taskDeployed: (title: string, priority: string, assignee: string) => {
    try {
      if (canTrack()) posthog.capture('workspace_task_deployed', { title, priority, assignee });
    } catch (e) { void e; }
  },

  // Custom Event: High-Intent Lead Capture
  serviceRequested: (serviceName: string, targetWebsite: string) => {
    try {
      if (canTrack()) posthog.capture('service_requested', { service: serviceName, website: targetWebsite });
    } catch (e) { void e; }
  }
};
