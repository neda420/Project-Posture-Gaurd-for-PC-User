# posture-guard-sdk

[![npm version](https://img.shields.io/npm/v/posture-guard-sdk)](https://www.npmjs.com/package/posture-guard-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/actions/workflows/ci.yml/badge.svg)](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/actions/workflows/ci.yml)

Framework-agnostic posture detection SDK powered by [TensorFlow.js MoveNet](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection).  
Works in React, Vue, Svelte, vanilla JS, and Electron—anywhere that has a webcam and a browser API.

## Installation

```bash
npm install posture-guard-sdk @tensorflow/tfjs @tensorflow-models/pose-detection
```

> **Note:** `@tensorflow/tfjs` and `@tensorflow-models/pose-detection` are peer dependencies and must be installed alongside the SDK.

## Quick Start

```ts
import { PostureDetector } from "posture-guard-sdk";

const detector = new PostureDetector({
  threshold: 120,      // px – larger = more sensitive
  alertCooldown: 8000, // ms between repeated alerts
});

detector.on("posture-change", (analysis) => {
  console.log(analysis.status); // "good" | "slouching" | "unknown"
});

detector.on("alert", (alert) => {
  // Trigger a notification, play a sound, etc.
  console.warn(alert.message);
});

detector.on("error", (err) => {
  console.error("Detector error:", err);
});

await detector.start(); // opens webcam + loads model

// Later – release all resources:
detector.dispose();
```

## Pure Analysis Function

If you already have keypoints from your own pipeline you can call the pure helper directly:

```ts
import { analyzePosture } from "posture-guard-sdk";

const analysis = analyzePosture(poses[0].keypoints, { threshold: 100 });
console.log(analysis.status);          // "good" | "slouching" | "unknown"
console.log(analysis.verticalDistance); // number | null
```

## API Reference

See [docs/API.md](../../docs/API.md) for the full reference.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `threshold` | `number` | `100` | Pixel distance below which slouching is detected |
| `alertCooldown` | `number` | `5000` | Milliseconds between repeated `alert` events |
| `minConfidence` | `number` | `0.5` | Minimum keypoint confidence score (0–1) |
| `videoConstraints` | `VideoConstraints` | `{width:640,height:480}` | getUserMedia constraints |

## Events

| Event | Payload | Description |
|---|---|---|
| `posture-change` | `PostureAnalysis` | Fired on every detection frame |
| `alert` | `PostureAlert` | Fired when slouching is detected after cooldown |
| `error` | `Error` | Fired on unrecoverable setup or detection error |

## License

MIT © MD. Nadimul Islam
