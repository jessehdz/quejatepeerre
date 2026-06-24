import React from 'react';
import ReactDOM from 'react-dom/client';
import { config } from '@maptiler/sdk';
import App from './App';
import './index.css';
// MapTiler's global stylesheet — imported once here, not inside MapView
import '@maptiler/sdk/dist/maptiler-sdk.css';

// Initialize MapTiler API key before any map component mounts.
// This must run before the first Map render or the SDK throws.
config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
