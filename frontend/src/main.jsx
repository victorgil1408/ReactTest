import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
    applicationId: 'a88d7d1e-5397-4c16-ab2c-968270ad8966',
    clientToken: 'pub29496b6508a0d54b113975e439c29aaa',
    site: 'datadoghq.com',
    service:'react-test-frontend',
    env: 'dev',
    
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate:  100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ router: true })],
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
