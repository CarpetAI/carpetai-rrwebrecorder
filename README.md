# Session Recorder

A React component and hook for recording user sessions using [rrweb](https://github.com/rrweb-io/rrweb). This package provides an easy way to capture user interactions and create session replays for analytics and debugging purposes.

## Features

- 🎥 Automatic session recording with configurable options
- 🔧 Flexible configuration for recording behavior
- 📱 React hook for custom implementations
- 🛡️ Built-in safety limits to prevent runaway recordings
- 🎯 Path-based exclusions (localhost excluded by default)
- 📊 Automatic backend integration with CarpetAI's Analytics Agent
- 🔄 Session persistence across page reloads
- 📦 Framework agnostic (works with any React setup)

## Installation

```bash
npm install @carpetai/rrweb-recorder rrweb
# or
yarn add @carpetai/rrweb-recorder rrweb
```

### For Next.js Users

If you're using Next.js 13+ with the app router, we recommend using our Next.js wrapper package:

```bash
npm install @carpetai/rrweb-recorder-nextjs
# or
yarn add @carpetai/rrweb-recorder-nextjs
```

This eliminates the need for `'use client'` wrapper components. See [@carpetai/rrweb-recorder-nextjs](https://github.com/CarpetAI/carpetai-rrwebrecorder-nextjs) for more details.

## Quick Start

### Basic Usage

```tsx
import { SessionRecorder } from '@carpetai/rrweb-recorder';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SessionRecorder 
        apiKey="your-carpetai-api-key"
      />
    </div>
  );
}
```

### Recording on Localhost

By default, the recorder excludes localhost URLs. To enable recording on localhost, set `excludePaths` to an empty array or customize the exclusions:

```tsx
import { SessionRecorder } from '@carpetai/rrweb-recorder';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SessionRecorder 
        apiKey="your-carpetai-api-key"
        excludePaths={[]} // Enable recording on localhost
      />
    </div>
  );
}
```

### Custom Path Exclusions

```tsx
import { SessionRecorder } from '@carpetai/rrweb-recorder';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SessionRecorder 
        apiKey="your-carpetai-api-key"
        excludePaths={[
          'https://admin.example.com', // Exclude admin panel
          'https://example.com/private' // Exclude private pages
        ]}
      />
    </div>
  );
}
```

### Using the Hook

```tsx
import { useSessionRecorder } from '@carpetai/rrweb-recorder';

function MyComponent() {
  const { isRecording, sessionId, startRecording, stopRecording } = useSessionRecorder({
    apiKey: "your-carpetai-api-key"
  });

  return (
    <div>
      <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
      <p>Session ID: {sessionId}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
}
```

## API Reference

### SessionRecorder Component

The main React component for automatic session recording.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoStart` | `boolean` | `true` | Whether to start recording automatically |
| `apiKey` | `string` | - | CarpetAI API key for authentication |
| `apiUrl` | `string` | `CarpetAI default endpoint` | Custom API endpoint (optional) |
| `maxSessionDuration` | `number` | `30 * 60 * 1000` | Maximum session duration in milliseconds (30 minutes) |
| `saveInterval` | `number` | `5000` | How often to save events (5 seconds) |
| `excludePaths` | `string[]` | `['http://localhost', 'https://localhost', 'http://127.0.0.1', 'https://127.0.0.1']` | Paths to exclude from recording (localhost excluded by default) |
| `recordCanvas` | `boolean` | `false` | Whether to record canvas elements |
| `recordCrossOriginIframes` | `boolean` | `false` | Whether to record cross-origin iframes |
| `sessionId` | `string` | `auto-generated` | Custom session ID |
| `onSessionStart` | `(sessionId: string) => void` | - | Callback when recording starts |
| `onSessionStop` | `(sessionId: string) => void` | - | Callback when recording stops |
| `onError` | `(error: Error) => void` | - | Error handler |

### useSessionRecorder Hook

A React hook that provides session recording state and control functions.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isRecording` | `boolean` | Whether recording is currently active |
| `sessionId` | `string \| null` | Current session ID |
| `startRecording` | `() => void` | Function to start recording |
| `stopRecording` | `() => void` | Function to stop recording |

**Note**: The hook automatically manages recording lifecycle when `autoStart` is true, but you can also control it manually using the provided functions.

## Advanced Usage

### Custom API Endpoint

```tsx
import { SessionRecorder } from '@carpetai/rrweb-recorder';

function App() {
  return (
    <SessionRecorder 
      apiKey="your-carpetai-api-key"
      apiUrl="https://your-custom-endpoint.com/api/sessions"
    />
  );
}
```

### Conditional Recording

```tsx
import { useSessionRecorder } from '@carpetai/rrweb-recorder';

function MyApp() {
  const { isRecording, sessionId, startRecording, stopRecording } = useSessionRecorder({
    autoStart: false, // Don't start automatically
    apiKey: "your-carpetai-api-key"
  });

  const handleUserConsent = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      <button onClick={handleUserConsent}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <p>Session ID: {sessionId}</p>}
    </div>
  );
}
```

## Types

### SessionData

```typescript
interface SessionData {
  sessionId: string;
  events: SessionEvent[];
  timestamp: number;
  url?: string;
}
```

### SessionEvent

```typescript
interface SessionEvent {
  type: number;
  timestamp: number;
  data: Record<string, unknown>;
  delay?: number;
}
```

## Safety Features

- **Session Duration Limit**: Automatically stops recording after a configurable duration
- **Path Exclusions**: Skip recording on specific paths
- **Error Handling**: Graceful error handling with optional callbacks
- **Automatic Backend Integration**: Sends data to CarpetAI's Analytics Agent automatically

## Browser Support

This package works in all modern browsers that support:
- ES2018+ features
- React 16.8+ (for hooks)
- rrweb compatibility

## License

MIT 