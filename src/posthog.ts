import posthog from 'posthog-js';

// Skip analytics entirely when running under a headless/automated browser
// (this is what the build-time prerender step uses) so every CI build
// doesn't register as synthetic traffic in real analytics.
const isAutomatedBrowser = typeof navigator !== 'undefined' && navigator.webdriver === true;

if (!isAutomatedBrowser) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug(); // Helps with debugging locally
    },
    autocapture: true, // Automatically tracks button clicks and page views
    capture_pageview: false // We will handle this manually in React Router
  });
}

export const Telemetry = {
  // Bind Firebase Auth to PostHog
  identifyEntity: (uid: string, email: string, name: string) => {
    posthog.identify(uid, { email, name });
  },
  
  // Clear identity on logout
  disconnectEntity: () => {
    posthog.reset();
  },

  // Custom Event: When someone uploads an image for the Gemini Extension
  visualAuditTriggered: (targetBusiness: string) => {
    posthog.capture('visual_audit_triggered', { business: targetBusiness });
  },

  // Custom Event: Workspace Activity
  taskDeployed: (title: string, priority: string, assignee: string) => {
    posthog.capture('workspace_task_deployed', { title, priority, assignee });
  },

  // Custom Event: High-Intent Lead Capture
  serviceRequested: (serviceName: string, targetWebsite: string) => {
    posthog.capture('service_requested', { service: serviceName, website: targetWebsite });
  }
};
