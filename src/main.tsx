// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalErrorBoundary } from './components';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Fatal: can't even mount
  document.body.innerHTML = `
    <div style="background:#020617;color:#fff;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;">
      <div style="text-align:center;">
        <h1 style="color:#eab308;">Critical Failure</h1>
        <p>Root element not found. Deployment compromised.</p>
      </div>
    </div>
  `;
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
