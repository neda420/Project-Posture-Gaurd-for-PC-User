# posture-guard-sdk – API Reference

## Installation

```bash
npm install posture-guard-sdk @tensorflow/tfjs @tensorflow-models/pose-detection
```

---

## `PostureDetector`

High-level class that manages webcam access, model loading, and continuous posture analysis.  
Must be used in a browser context with access to `navigator.mediaDevices` and `requestAnimationFrame`.

### Constructor

```ts
new PostureDetector(options?: PostureDetectorOptions)
```

#### `PostureDetectorOptions`

| Property | Type | Default | Description |
|---|---|---|---|
| `threshold` | `number` | `100` | Vertical pixel distance (shoulder midpoint Y − nose Y) below which slouching is detected. Increase for higher sensitivity. |
| `alertCooldown` | `number` | `5000` | Milliseconds that must elapse between consecutive `alert` events. Prevents notification spam. |
| `minConfidence` | `number` | `0.5` | Minimum keypoint confidence score (0–1) for a keypoint to be used. |
| `videoConstraints` | `VideoConstraints \| boolean` | `{width:640, height:480}` | Passed directly to `getUserMedia`. |

### Methods

#### `detector.start() → Promise<void>`

Opens the webcam stream and loads the TF.js MoveNet model.  
Resolves when the detector is ready.  
Throws (and emits `"error"`) if camera access is denied or the model fails to load.

```ts
await detector.start();
```

#### `detector.stop() → void`

Stops the detection loop and releases the camera stream.  
The TF.js model remains in memory; call `dispose()` to release it.

#### `detector.dispose() → void`

Calls `stop()`, disposes the TF.js model (freeing GPU memory), and removes all event listeners.  
Call this when you are done with the detector.

#### `detector.setThreshold(value: number) → void`

Dynamically update the slouch threshold without restarting the detector.

#### `detector.setAlertCooldown(ms: number) → void`

Dynamically update the alert cooldown without restarting.

#### `detector.isRunning → boolean`

Read-only property. `true` while the detection loop is active.

### Events

Use `.on(event, listener)`, `.once(event, listener)`, and `.off(event, listener)` to subscribe.

#### `"posture-change"` → `PostureAnalysis`

Emitted on every detection frame (~30 fps depending on the device).

```ts
detector.on("posture-change", (analysis) => {
  console.log(analysis.status); // "good" | "slouching" | "unknown"
});
```

#### `"alert"` → `PostureAlert`

Emitted when slouching is detected **and** the cooldown period has elapsed.

```ts
detector.on("alert", (alert) => {
  new Notification(alert.message); // browser Notifications API
});
```

#### `"error"` → `Error`

Emitted on unrecoverable errors during setup or the detection loop.

```ts
detector.on("error", (err) => console.error(err));
```

---

## `analyzePosture`

Pure, side-effect-free function.  Use this if you already have keypoints from your own pipeline.

```ts
function analyzePosture(
  keypoints: Keypoint[],
  options?: AnalyzePostureOptions
): PostureAnalysis
```

### Parameters

| Param | Type | Description |
|---|---|---|
| `keypoints` | `Keypoint[]` | Array of keypoints from any pose-detection model. Must include `nose`, `left_shoulder`, `right_shoulder` to produce a definitive result. |
| `options.threshold` | `number` | Override the default slouch threshold (100 px). |
| `options.minConfidence` | `number` | Override the default minimum keypoint confidence (0.5). |

### Return value – `PostureAnalysis`

| Field | Type | Description |
|---|---|---|
| `status` | `"good" \| "slouching" \| "unknown"` | Overall posture classification. |
| `verticalDistance` | `number \| null` | `shoulderMidpointY − noseY` in pixels. |
| `shoulderMidpointY` | `number \| null` | Y-coordinate of the midpoint between both shoulders. |
| `noseY` | `number \| null` | Y-coordinate of the nose keypoint. |
| `confidence` | `number` | Minimum confidence score across the three used keypoints. |

---

## Types

```ts
interface Keypoint {
  name?: string;
  x: number;
  y: number;
  score?: number;
}

interface PostureAnalysis {
  status: "good" | "slouching" | "unknown";
  verticalDistance: number | null;
  shoulderMidpointY: number | null;
  noseY: number | null;
  confidence: number;
}

interface PostureAlert {
  type: "slouching";
  message: string;
  timestamp: number;   // Date.now()
  analysis: PostureAnalysis;
}

interface PostureDetectorOptions {
  threshold?: number;
  alertCooldown?: number;
  minConfidence?: number;
  videoConstraints?: VideoConstraints | boolean;
}

interface VideoConstraints {
  width?: number | { ideal?: number; min?: number; max?: number };
  height?: number | { ideal?: number; min?: number; max?: number };
  facingMode?: string;
  deviceId?: string;
}
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| `getUserMedia` | ✅ 53+ | ✅ 36+ | ✅ 11+ | ✅ 12+ |
| WebGL (TF.js) | ✅ | ✅ | ✅ | ✅ |
| Web Workers | ✅ | ✅ | ✅ | ✅ |

> **Note:** Camera access requires HTTPS (or `localhost`) in all browsers.

---

## Privacy

All machine learning inference runs **locally on the user's device**.  
No video frames, images, or keypoint data are ever transmitted to a server.
