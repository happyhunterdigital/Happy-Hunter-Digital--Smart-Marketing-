import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalErrorBoundary } from './components';
import './index.css';

// Fatal error handler - runs before React
const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = `
    <div style="
      background: #020617;
      color: #fff;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      text-align: center;
      padding: 2rem;
    ">
      <div>
        <h1 style="color: #eab308; font-size: 2rem; margin-bottom: 1rem;">
          ⚠️ Critical Failure
        </h1>
        <p>Root element not found. Deployment compromised.</p>
        <p style="color: #64748b; margin-top: 1rem; font-size: 0.875rem;">
          Contact: hello@happyhunterdigital.com
        </p>
      </div>
    </div>
  `;
  throw new Error('Root element #root not found - check index.html');
}

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
