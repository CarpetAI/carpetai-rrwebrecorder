export interface SessionEvent {
  type: number;
  timestamp: number;
  data: any;
  delay?: number;
}

export interface SessionData {
  sessionId: string;
  events: SessionEvent[];
  timestamp: number;
  url?: string;
}

export type SaveSessionDataFunction = (data: SessionData) => Promise<void>;

export interface SessionRecorderProps {
  autoStart?: boolean;
  apiKey: string;
  apiUrl?: string;
  maxSessionDuration?: number;
  maxEventsPerSession?: number;
  saveInterval?: number;
  excludePaths?: string[];
  recordCanvas?: boolean;
  recordCrossOriginIframes?: boolean;
  sessionId?: string;
  onSessionStart?: (sessionId: string) => void;
  onSessionStop?: (sessionId: string) => void;
  onError?: (error: Error) => void;
}

export interface SessionRecorderHookReturn {
  isRecording: boolean;
  sessionId: string | null;
  startRecording: () => void;
  stopRecording: () => void;
} 