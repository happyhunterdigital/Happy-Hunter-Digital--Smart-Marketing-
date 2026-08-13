import * as Sentry from '@sentry/react';

// Skip error reporting entirely when running under a headless/automated
// browser (this is what the build-time prerender step uses) so CI builds
// don't register synthetic errors against production monitoring.
const isAutomatedBrowser = typeof navigator !== 'undefined' && navigator.webdriver === true;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (!isAutomatedBrowser && sentryDsn) {
  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.PROD ? 'production' : 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Tracing + Session Replay. Sample rates are tuned to control Sentry
      // volume/cost on a high-traffic lead site — raise them if you want more data.
      tracesSampleRate: 0.1,
      tracePropagationTargets: ['localhost'],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: false,
    });
  } catch (err) {
    console.warn('Sentry initialization notice:', err);
  }
}

export const isSentryConfigured = Boolean(sentryDsn);

export const ErrorReporter = {
  // Report a captured React error boundary failure to Sentry.
  captureError: (error: Error, info?: { componentStack?: string | null }) => {
    if (!sentryDsn) return;
    try {
      if (info?.componentStack) {
        Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });
      } else {
        Sentry.captureException(error);
      }
    } catch {
      // Never let error reporting break the app.
    }
  },

  // Report an unexpected exception that didn't reach a boundary.
  captureMessage: (message: string, extra?: Record<string, unknown>) => {
    if (!sentryDsn) return;
    try {
      Sentry.captureMessage(message, { extra });
    } catch {
      // no-op
    }
  },
};