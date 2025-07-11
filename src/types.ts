export interface SessionEvent {
  type: number;
  timestamp: number;
  data: Record<string, unknown>;
  delay?: number;
}

export interface SessionData {
  sessionId: string;
  events: SessionEvent[];
  timestamp: number;
  url?: string;
}

export interface SessionRecorderProps {
  autoStart?: boolean;
  apiKey: string;
  apiUrl?: string;
  maxSessionDuration?: number;
  saveInterval?: number;
  excludePaths?: string[];
  recordCanvas?: boolean;
  recordCrossOriginIframes?: boolean;
  onSessionStart?: (sessionId: string) => void;
  onSessionStop?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  maskAllInputs?: boolean;
}

export interface SessionRecorderHookReturn {
  isRecording: boolean;
  sessionId: string | null;
  startRecording: () => void;
  stopRecording: () => void;
} 