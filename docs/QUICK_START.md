# Quick Start – posture-guard-sdk

This guide takes you from zero to a working posture detector in under 5 minutes.

## 1. Install

```bash
npm install posture-guard-sdk @tensorflow/tfjs @tensorflow-models/pose-detection
```

> **Requirements**
> - Browser environment with webcam access (HTTPS or `localhost`)
> - Node.js ≥ 18 (for tooling / Electron)

## 2. Minimal usage

```ts
import { PostureDetector } from "posture-guard-sdk";

const detector = new PostureDetector();

detector.on("alert", (alert) => {
  alert(alert.message); // Replace with your preferred notification
});

detector.on("error", (err) => {
  console.error("PostureDetector error:", err);
});

await detector.start();
```

That's it.  The detector will:

1. Request webcam access from the user.
2. Download and initialise the TF.js MoveNet model (one-time, ~3 MB).
3. Emit an `alert` event whenever slouching is detected.

## 3. Clean up

Always call `dispose()` to release the camera and free GPU memory when the user navigates away or closes the component.

```ts
window.addEventListener("beforeunload", () => detector.dispose());
```

## 4. Adjust sensitivity

```ts
const detector = new PostureDetector({
  threshold: 130,       // px – higher = triggers slouch alert sooner
  alertCooldown: 10000, // ms – wait 10 s between repeated alerts
  minConfidence: 0.6,   // require higher keypoint confidence
});
```

## 5. React example

See [examples/react.md](./examples/react.md) for a full React hook implementation.

## 6. Vanilla JS / browser script

See [examples/vanilla-js.md](./examples/vanilla-js.md).

## 7. Electron integration

See [examples/electron.md](./examples/electron.md) for native desktop notifications.

---

## Next steps

- [Full API Reference](./API.md)
- [Examples](./examples/)
- [Contributing](../CONTRIBUTING.md)
