import posthog from 'posthog-js';

// Initialize PostHog (Replace with your actual Project API Key from posthog.com)
posthog.init('YOUR_POSTHOG_PROJECT_API_KEY', {
  api_host: 'https://app.posthog.com', // Use 'https://eu.posthog.com' if you selected EU hosting
  loaded: (posthog) => {
    if (import.meta.env.DEV) posthog.debug(); // Helps with debugging locally
  },
  autocapture: true, // Automatically tracks button clicks and page views
  capture_pageview: false // We will handle this manually in React Router
});

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
  }
};
