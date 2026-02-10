import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
    applicationId: 'a88d7d1e-5397-4c16-ab2c-968270ad8966',
    clientToken: 'pub29496b6508a0d54b113975e439c29aaa',
    
    // IMPORTANTE: Verifica que tu cuenta de Datadog sea US1. 
    // Si en la URL de Datadog ves "us5.datadoghq.com", cambia esto a 'us5.datadoghq.com'
    site: 'datadoghq.com', 
    
    service:'react-test-frontend',
    env: 'dev',
    version: '1.0.0',
    
    // --- LO QUE FALTABA ---
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100, // Subámoslo a 100 para asegurar que te grabe a ti
    trackUserInteractions: true,  // VITAL: Sin esto, no registra tus clics
    trackResources: true,         // VITAL: Para ver las llamadas al backend
    trackLongTasks: true,         // Para ver si la UI se congela
    defaultPrivacyLevel: 'mask-user-input',
    
    plugins: [reactPlugin({ 
        router: true // Correcto para integrarse con React Router
    })],
});

// VITAL: Activar la grabación de video (Session Replay)
datadogRum.startSessionReplayRecording();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)