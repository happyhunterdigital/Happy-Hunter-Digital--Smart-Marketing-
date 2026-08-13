import posthog from 'posthog-js';

// Skip analytics entirely when running under a headless/automated browser
// (this is what the build-time prerender step uses) so every CI build
// doesn't register as synthetic traffic in real analytics.
const isAutomatedBrowser = typeof navigator !== 'undefined' && navigator.webdriver === true;
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

if (!isAutomatedBrowser && posthogKey) {
  try {
    posthog.init(posthogKey, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      loaded: (ph) => {
        if (import.meta.env.DEV) ph.debug(); // Helps with debugging locally
      },
      autocapture: true, // Automatically tracks button clicks and page views
      capture_pageview: false // We will handle this manually in React Router
    });
  } catch (err) {
    console.warn("PostHog initialization notice:", err);
  }
}

export const Telemetry = {
  // Bind Firebase Auth to PostHog
  identifyEntity: (uid: string, email: string, name: string) => {
    try {
      if (posthogKey) posthog.identify(uid, { email, name });
    } catch (e) { void e; }
  },
  
  // Clear identity on logout
  disconnectEntity: () => {
    try {
      if (posthogKey) posthog.reset();
    } catch (e) { void e; }
  },

  // Custom Event: When someone uploads an image for the Gemini Extension
  visualAuditTriggered: (targetBusiness: string) => {
    try {
      if (posthogKey) posthog.capture('visual_audit_triggered', { business: targetBusiness });
    } catch (e) { void e; }
  },

  // Custom Event: Workspace Activity
  taskDeployed: (title: string, priority: string, assignee: string) => {
    try {
      if (posthogKey) posthog.capture('workspace_task_deployed', { title, priority, assignee });
    } catch (e) { void e; }
  },

  // Custom Event: High-Intent Lead Capture
  serviceRequested: (serviceName: string, targetWebsite: string) => {
    try {
      if (posthogKey) posthog.capture('service_requested', { service: serviceName, website: targetWebsite });
    } catch (e) { void e; }
  }
};
