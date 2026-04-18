/**
 * posture-guard-sdk
 *
 * Public API surface – import anything your application needs from this entry
 * point.  Internal modules should not be imported directly.
 */

// Core analysis
export { analyzePosture } from "./analyzePosture.js";
export type { Keypoint, PostureAnalysis, AnalyzePostureOptions } from "./analyzePosture.js";

// High-level detector
export { PostureDetector } from "./PostureDetector.js";

// Types
export type {
  PostureDetectorOptions,
  PostureDetectorEvents,
  PostureAlert,
  VideoConstraints,
} from "./types.js";
