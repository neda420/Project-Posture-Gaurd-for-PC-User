# Example – React Hook

A reusable `usePostureDetector` hook for React 18+.

```tsx
// src/hooks/usePostureDetector.ts
import { useEffect, useRef, useState } from "react";
import { PostureDetector } from "posture-guard-sdk";
import type { PostureDetectorOptions, PostureAnalysis, PostureAlert } from "posture-guard-sdk";

interface UsePostureDetectorResult {
  analysis: PostureAnalysis | null;
  lastAlert: PostureAlert | null;
  error: Error | null;
  isRunning: boolean;
}

export function usePostureDetector(
  options?: PostureDetectorOptions
): UsePostureDetectorResult {
  const detectorRef = useRef<PostureDetector | null>(null);
  const [analysis, setAnalysis]   = useState<PostureAnalysis | null>(null);
  const [lastAlert, setLastAlert] = useState<PostureAlert | null>(null);
  const [error, setError]         = useState<Error | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const detector = new PostureDetector(options);
    detectorRef.current = detector;

    detector.on("posture-change", setAnalysis);
    detector.on("alert",         setLastAlert);
    detector.on("error",         setError);

    detector
      .start()
      .then(() => setIsRunning(true))
      .catch(setError);

    return () => {
      detector.dispose();
      setIsRunning(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // options intentionally excluded – mutate via setThreshold instead

  return { analysis, lastAlert, error, isRunning };
}
```

### Usage in a component

```tsx
// src/components/PostureWidget.tsx
import { usePostureDetector } from "../hooks/usePostureDetector";

export default function PostureWidget() {
  const { analysis, lastAlert, error, isRunning } = usePostureDetector({
    threshold: 120,
    alertCooldown: 8000,
  });

  if (!isRunning) return <p>Starting camera…</p>;
  if (error)      return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const color =
    analysis?.status === "good"     ? "green" :
    analysis?.status === "slouching"? "red"   : "grey";

  return (
    <div>
      <p style={{ color, fontWeight: "bold" }}>
        Posture: {analysis?.status ?? "unknown"}
      </p>
      {lastAlert && (
        <p style={{ color: "orange" }}>⚠️ {lastAlert.message}</p>
      )}
    </div>
  );
}
```
