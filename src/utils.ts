import { SessionData } from './types';

export const defaultSaveSessionData = async (
  sessionData: SessionData, 
  apiKey: string, 
  apiUrl?: string
): Promise<void> => {
  const url = apiUrl || '/api/session-replay';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...sessionData,
        apiKey
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save session data: ${response.statusText}`);
    }
  } catch (error) {
    throw error;
  }
};

export const getOrCreateSessionId = (providedSessionId?: string): string => {
  if (typeof window === 'undefined') return '';
  
  if (providedSessionId) {
    return providedSessionId;
  }
  
  let sessionId = sessionStorage.getItem('rrweb_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('rrweb_session_id', sessionId);
  }
  return sessionId;
};

export const shouldExcludePath = (excludePaths?: string[]): boolean => {
  if (!excludePaths || typeof window === 'undefined') return false;
  
  const currentUrl = window.location.href;
  return excludePaths.some(path => currentUrl.startsWith(path));
};

export const createMetaEvent = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    type: 4,
    timestamp: Date.now(),
    data: {
      href: window.location.href,
      url: window.location.href,
      width: window.innerWidth,
      height: window.innerHeight,
      title: document.title,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };
};