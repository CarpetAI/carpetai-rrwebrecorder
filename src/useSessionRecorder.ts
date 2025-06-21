import { record } from 'rrweb';
import { useEffect, useRef, useState } from 'react';
import {
  SessionEvent,
  SessionData,
  SessionRecorderProps,
  SessionRecorderHookReturn
} from './types';
import {
  defaultSaveSessionData,
  getOrCreateSessionId,
  shouldExcludePath,
  createMetaEvent
} from './utils';

export function useSessionRecorder({
  autoStart = true,
  apiKey,
  apiUrl = "https://apt-agent-api-c5f32b392702.herokuapp.com/api/sessions",
  maxSessionDuration = 30 * 60 * 1000,
  saveInterval = 5000,
  excludePaths = [],
  recordCanvas = false,
  recordCrossOriginIframes = false,
  sessionId: customSessionId,
  onSessionStart,
  onSessionStop,
  onError
}: SessionRecorderProps): SessionRecorderHookReturn {
  const [isRecording, setIsRecording] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const eventsRef = useRef<SessionEvent[]>([]);
  const recorderRef = useRef<(() => void) | undefined>(undefined);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const lastSavedIndexRef = useRef(0);

  const emit = (event: SessionEvent) => {
    eventsRef.current.push(event);
  };

  const saveEvents = async () => {
    const currentSessionId = sessionIdRef.current;
    if (eventsRef.current.length === 0 || !currentSessionId) return;

    try {
      const newEvents = eventsRef.current.slice(lastSavedIndexRef.current);
      if (newEvents.length === 0) return;

      const sessionData: SessionData = {
        sessionId: currentSessionId,
        events: newEvents,
        timestamp: Date.now(),
        url: window.location.href
      };

      if (apiKey) {
        await defaultSaveSessionData(sessionData, apiKey, apiUrl);
      }

      lastSavedIndexRef.current = eventsRef.current.length;
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const addMetaEvent = () => {
    if (!isRecording || typeof window === 'undefined') return;
    
    const metaEvent = createMetaEvent();
    if (metaEvent) {
      eventsRef.current.push(metaEvent);
    }
  };

  const startRecording = () => {
    if (isRecording || typeof window === 'undefined') return;

    const currentSessionId = customSessionId || getOrCreateSessionId();
    sessionIdRef.current = currentSessionId;
    sessionStartTimeRef.current = Date.now();
    lastSavedIndexRef.current = 0;
    eventsRef.current = [];

    try {
      recorderRef.current = record({
        emit,
        recordCanvas,
        recordCrossOriginIframes
      });

      setIsRecording(true);
      onSessionStart?.(currentSessionId);

      addMetaEvent();

      saveIntervalRef.current = setInterval(saveEvents, saveInterval);

      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, maxSessionDuration);

    } catch (error) {
      onError?.(error as Error);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    if (recorderRef.current) {
      recorderRef.current();
      recorderRef.current = undefined;
    }

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    setIsRecording(false);
    onSessionStop?.(sessionIdRef.current!);

    saveEvents();
  };

  useEffect(() => {
    if (autoStart && !shouldExcludePath(excludePaths)) {
      const timer = setTimeout(() => {
        startRecording();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, excludePaths]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (isRecording) {
        setTimeout(() => {
          addMetaEvent();
        }, 100);
      }
    };

    const handleHashChange = () => {
      if (isRecording) {
        setTimeout(() => {
          addMetaEvent();
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return {
    isRecording,
    sessionId: sessionIdRef.current,
    startRecording,
    stopRecording
  };
} 