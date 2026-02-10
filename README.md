# React Test - Datadog APM & RUM Integration

A full-stack application demonstrating Datadog Application Performance Monitoring (APM) for Node.js backend and Real User Monitoring (RUM) for React frontend.

## Architecture

- **Frontend**: React 19 with Vite, React Router, and Datadog RUM
- **Backend**: Node.js with Express, serving both API endpoints and static frontend files
- **Monitoring**: Datadog APM (backend traces) + Datadog RUM (frontend analytics)

## Prerequisites

- Node.js (v16 or higher)
- npm
- A Datadog account with:
  - An Application ID and Client Token for RUM
  - API access for APM traces

## Installation

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Build the Frontend

```bash
cd frontend
npm run build
```

This creates a production build in `frontend/dist/` that the backend will serve.

## Datadog APM Instrumentation (Backend)

The backend uses `dd-trace` to automatically instrument Express.js and track distributed traces.

### Step 1: Install dd-trace

```bash
cd backend
npm install dd-trace
```

### Step 2: Initialize Tracer (MUST be first import)

In `backend/index.js`, the tracer is initialized **before any other imports**:

```javascript
const tracer = require('dd-trace').init({
  service: 'react-test-backend',  // Service name in Datadog
  env: 'dev',                      // Environment (dev/staging/prod)
  version: '1.0.0',                // Version for deployment tracking
  logInjection: true               // Optional: correlate logs with traces
});
```

**Important**: This must be the first line of your application to properly instrument all downstream dependencies.

### Step 3: Configure CORS for Distributed Tracing

To enable trace propagation between frontend and backend, CORS must allow Datadog headers:

```javascript
app.use(cors({
  origin: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-datadog-trace-id',
    'x-datadog-parent-id',
    'x-datadog-origin',
    'x-datadog-sampling-priority',
    'traceparent',
    'tracestate'
  ]
}));
```

### Step 4: Set Environment Variables (Optional)

For production, configure these environment variables instead of hardcoding:

```bash
export DD_SERVICE=react-test-backend
export DD_ENV=production
export DD_VERSION=1.0.0
export DD_TRACE_AGENT_URL=http://localhost:8126  # If using custom agent
```

## Datadog RUM Instrumentation (Frontend)

The frontend uses `@datadog/browser-rum` and `@datadog/browser-rum-react` to track user sessions, interactions, and performance.

### Step 1: Install RUM Packages

```bash
cd frontend
npm install @datadog/browser-rum @datadog/browser-rum-react
```

### Step 2: Initialize RUM SDK

In `frontend/src/main.jsx`, initialize RUM **before rendering the app**:

```javascript
import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: 'YOUR_APPLICATION_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'datadoghq.com',  // Change to your Datadog site (e.g., us5.datadoghq.com)

  service: 'react-test-frontend',
  env: 'dev',
  version: '1.0.0',

  // Sampling rates (100 = 100% of sessions)
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,  // Enable session replay for all sessions

  // Tracking options
  trackUserInteractions: true,   // Track clicks, scrolls, etc.
  trackResources: true,          // Track XHR/Fetch requests
  trackLongTasks: true,          // Track performance bottlenecks

  // Privacy
  defaultPrivacyLevel: 'mask-user-input',  // Masks user input in session replays

  // React Router integration
  plugins: [reactPlugin({ router: false })]
});

// Enable session replay recording
datadogRum.startSessionReplayRecording();
```

### Step 3: Get Your Credentials

1. Log in to [Datadog](https://app.datadoghq.com/)
2. Navigate to **UX Monitoring** > **RUM Applications**
3. Create a new application or select an existing one
4. Copy your `applicationId` and `clientToken`
5. Verify your Datadog site (check your URL: `us1`, `us5`, `eu1`, etc.)

### Step 4: React Router Integration

The React plugin automatically tracks route changes when configured with `router: true`. No additional configuration needed if using React Router.

## Running the Application

### Development Mode

```bash
# Terminal 1: Run backend (serves API + frontend)
cd backend
node index.js

# Access the app at http://localhost:3000
```

The backend serves:
- API endpoints: `/api/home`, `/api/about`, `/api/contact`
- Static frontend: All other routes serve `frontend/dist/index.html`

### Making Changes to Frontend

If you modify frontend code:

```bash
cd frontend
npm run build  # Rebuild
# Then restart the backend server
```

## What You'll See in Datadog

### APM (Application Performance Monitoring)

Navigate to **APM** > **Services** > `react-test-backend`:

- **Service Map**: Visual representation of your services
- **Traces**: Individual request traces showing:
  - HTTP requests to `/api/home`, `/api/about`, `/api/contact`
  - Response times, status codes, errors
  - Distributed traces linking frontend RUM to backend APM
- **Performance Metrics**: Latency, throughput, error rates

### RUM (Real User Monitoring)

Navigate to **UX Monitoring** > **RUM Applications** > `react-test-frontend`:

- **Sessions**: User session recordings with:
  - Page views and navigation paths
  - User clicks and interactions
  - Console logs and errors
  - Network requests to backend API
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Errors**: JavaScript errors and stack traces
- **Session Replays**: Video-like playback of user sessions

### Distributed Tracing

When a user clicks a link in the React app:
1. RUM tracks the click and route change
2. Frontend makes a fetch request to `/api/*`
3. RUM sends trace headers (`x-datadog-trace-id`, etc.)
4. Backend APM receives these headers and correlates the trace
5. You can see the full journey from frontend click → backend API → response in Datadog

## Project Structure

```
ReactTest/
├── backend/
│   ├── index.js           # Express server with dd-trace init
│   ├── package.json       # Backend dependencies (dd-trace, express, cors)
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── main.jsx       # RUM initialization
│   │   ├── App.jsx        # React Router setup
│   │   └── index.css      # Styles
│   ├── dist/              # Built files (served by backend)
│   ├── package.json       # Frontend dependencies (RUM packages)
│   ├── vite.config.js     # Vite configuration
│   └── node_modules/
└── README.md
```

## Key Datadog Concepts

### Service
A logical grouping of endpoints (e.g., `react-test-backend`, `react-test-frontend`)

### Environment
Deployment stage (`dev`, `staging`, `prod`) to filter data

### Version
Release version for tracking deployments and comparing performance

### Trace
Complete journey of a request across services

### Span
Individual operation within a trace (e.g., database query, HTTP request)

### Session
User interaction period on the frontend (up to 4 hours)

### Session Replay
Video-like recording of user actions and UI changes

## Troubleshooting

### No traces in APM
- Verify `dd-trace` is initialized **first** in `backend/index.js`
- Check that the Datadog Agent is running (or using Agentless mode)
- Set `DD_TRACE_DEBUG=true` for verbose logging

### No sessions in RUM
- Verify `applicationId` and `clientToken` are correct
- Check browser console for RUM initialization errors
- Ensure `sessionSampleRate` is > 0 (set to 100 for testing)
- Verify `site` matches your Datadog region

### CORS errors
- Ensure backend CORS includes Datadog trace headers
- Check browser console for specific blocked headers

### Session replays not recording
- Verify `datadogRum.startSessionReplayRecording()` is called
- Check `sessionReplaySampleRate` is > 0
- Ensure content security policy allows Datadog endpoints

## Additional Resources

- [Datadog APM Node.js Documentation](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/)
- [Datadog RUM React Documentation](https://docs.datadoghq.com/real_user_monitoring/browser/setup/#react)
- [Datadog Distributed Tracing](https://docs.datadoghq.com/tracing/trace_collection/custom_instrumentation/)

## License

ISC
