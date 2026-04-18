/** A single pose keypoint as returned by TensorFlow.js pose-detection models. */
export interface Keypoint {
  name?: string;
  x: number;
  y: number;
  /** Confidence score in the range [0, 1]. */
  score?: number;
}

/** The result of a single posture analysis pass. */
export interface PostureAnalysis {
  /** Overall posture classification for this frame. */
  status: "good" | "slouching" | "unknown";
  /**
   * Signed pixel distance: `shoulderMidpointY − noseY`.
   * A smaller (or negative) value indicates the nose is close to (or below)
   * the shoulder line, which is interpreted as slouching.
   * `null` when keypoints are unavailable or below the confidence threshold.
   */
  verticalDistance: number | null;
  /** Y-coordinate of the midpoint between left and right shoulders. */
  shoulderMidpointY: number | null;
  /** Y-coordinate of the nose keypoint. */
  noseY: number | null;
  /** Minimum confidence score across the three used keypoints (0–1). */
  confidence: number;
}

/** Options for the `analyzePosture` pure function. */
export interface AnalyzePostureOptions {
  /**
   * Vertical pixel distance threshold below which slouching is flagged.
   * @default 100
   */
  threshold?: number;
  /**
   * Minimum keypoint confidence score required for inclusion.
   * @default 0.5
   */
  minConfidence?: number;
}

/**
 * Pure, side-effect-free function that evaluates posture from a set of
 * pose keypoints.
 *
 * It requires `nose`, `left_shoulder`, and `right_shoulder` keypoints to be
 * present and above `minConfidence`.  If any are missing the result will have
 * `status: "unknown"`.
 *
 * @param keypoints - Array of keypoints from a pose-detection model.
 * @param options   - Optional configuration overrides.
 * @returns         A {@link PostureAnalysis} describing the current posture.
 *
 * @example
 * ```ts
 * import { analyzePosture } from "posture-guard-sdk";
 *
 * const analysis = analyzePosture(poses[0].keypoints);
 * console.log(analysis.status); // "good" | "slouching" | "unknown"
 * ```
 */
export function analyzePosture(
  keypoints: Keypoint[],
  options: AnalyzePostureOptions = {}
): PostureAnalysis {
  const threshold = options.threshold ?? 100;
  const minConfidence = options.minConfidence ?? 0.5;

  const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
  const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
  const nose = keypoints.find((k) => k.name === "nose");

  if (
    !leftShoulder ||
    !rightShoulder ||
    !nose ||
    (leftShoulder.score ?? 0) < minConfidence ||
    (rightShoulder.score ?? 0) < minConfidence ||
    (nose.score ?? 0) < minConfidence
  ) {
    return {
      status: "unknown",
      verticalDistance: null,
      shoulderMidpointY: null,
      noseY: null,
      confidence: 0,
    };
  }

  const shoulderMidpointY = (leftShoulder.y + rightShoulder.y) / 2;
  const verticalDistance = shoulderMidpointY - nose.y;
  const confidence = Math.min(
    leftShoulder.score ?? 1,
    rightShoulder.score ?? 1,
    nose.score ?? 1
  );

  return {
    status: verticalDistance < threshold ? "slouching" : "good",
    verticalDistance,
    shoulderMidpointY,
    noseY: nose.y,
    confidence,
  };
}
