import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SyncProvider } from './context/SyncContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SyncProvider>
      <App />
    </SyncProvider>
  </React.StrictMode>
);
