export { default as SessionRecorder } from './SessionRecorder';
export { useSessionRecorder } from './useSessionRecorder';

export type {
  SessionEvent,
  SessionData,
  SaveSessionDataFunction,
  SessionRecorderProps,
  SessionRecorderHookReturn
} from './types';

export {
  defaultSaveSessionData,
  getOrCreateSessionId,
  shouldExcludePath,
  createMetaEvent
} from './utils'; 