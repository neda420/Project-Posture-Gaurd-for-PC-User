import type { PostureAnalysis } from "./analyzePosture.js";

/** getUserMedia video constraints forwarded to the SDK. */
export interface VideoConstraints {
  width?: number | { ideal?: number; min?: number; max?: number };
  height?: number | { ideal?: number; min?: number; max?: number };
  facingMode?: string;
  deviceId?: string;
}

/** Options passed to the PostureDetector constructor. */
export interface PostureDetectorOptions {
  /**
   * Vertical pixel distance (shoulder midpoint Y − nose Y) below which
   * slouching is detected.  Larger values = more sensitive.
   * @default 100
   */
  threshold?: number;
  /**
   * Minimum milliseconds between consecutive `alert` events.
   * Prevents notification spam.
   * @default 5000
   */
  alertCooldown?: number;
  /**
   * Minimum keypoint confidence score (0–1) required for a keypoint to be
   * used in the posture calculation.
   * @default 0.5
   */
  minConfidence?: number;
  /**
   * getUserMedia video constraints.
   * @default { width: 640, height: 480 }
   */
  videoConstraints?: VideoConstraints | boolean;
}

/** Emitted when a slouching posture is detected after the cooldown period. */
export interface PostureAlert {
  type: "slouching";
  message: string;
  timestamp: number;
  analysis: PostureAnalysis;
}

/** Typed event map for PostureDetector. */
export interface PostureDetectorEvents {
  /** Fired on every detection frame with the current analysis result. */
  "posture-change": PostureAnalysis;
  /** Fired when slouching is detected and the cooldown has elapsed. */
  alert: PostureAlert;
  /** Fired when an unrecoverable error occurs during detection. */
  error: Error;
}
