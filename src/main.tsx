import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary' // Import this

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary> {/* Wrap App here */}
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
