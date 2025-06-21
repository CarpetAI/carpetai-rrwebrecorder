import { useSessionRecorder } from './useSessionRecorder';
import { SessionRecorderProps } from './types';

function SessionRecorderInner(props: SessionRecorderProps) {
  useSessionRecorder(props);
  return null;
}

export default function SessionRecorder(props: SessionRecorderProps) {
  return (
    <SessionRecorderInner {...props} />
  );
} 