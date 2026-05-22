import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { fetchRemoteOverrides } from './admin/overrides';
import './index.css';

// Kick off the remote overrides fetch as early as possible so the merged view
// is ready by the time PdfsView mounts.
fetchRemoteOverrides();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
