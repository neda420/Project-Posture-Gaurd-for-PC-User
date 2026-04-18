import { MiniEventEmitter } from "./EventEmitter.js";
import { analyzePosture } from "./analyzePosture.js";
import type {
  PostureDetectorOptions,
  PostureDetectorEvents,
  PostureAlert,
} from "./types.js";

// These are intentionally dynamic imports so that TF.js is a peer dependency
// that consumers supply themselves.
type TFPoseDetector = import("@tensorflow-models/pose-detection").PoseDetector;

const DEFAULT_OPTIONS = {
  threshold: 100,
  alertCooldown: 5000,
  minConfidence: 0.5,
  videoConstraints: { width: 640, height: 480 },
} as const;

/**
 * High-level posture detector.
 *
 * Opens the webcam, loads the TensorFlow.js MoveNet model, and continuously
 * analyzes the user's posture.  Events are emitted for every detection frame
 * and whenever a slouching alert fires.
 *
 * Requires `@tensorflow/tfjs` and `@tensorflow-models/pose-detection` to be
 * installed by the consumer.  Must be used in a browser context where
 * `navigator.mediaDevices` and `requestAnimationFrame` are available.
 *
 * @example
 * ```ts
 * import { PostureDetector } from "posture-guard-sdk";
 *
 * const detector = new PostureDetector({ threshold: 120 });
 *
 * detector.on("alert", (alert) => {
 *   console.warn(alert.message);
 * });
 *
 * await detector.start();
 * ```
 */
export class PostureDetector extends MiniEventEmitter<PostureDetectorEvents> {
  private readonly _options: Required<PostureDetectorOptions>;
  private _detector: TFPoseDetector | null = null;
  private _stream: MediaStream | null = null;
  private _videoEl: HTMLVideoElement | null = null;
  private _animationId: number | null = null;
  private _lastAlertTime = 0;
  private _running = false;

  constructor(options: PostureDetectorOptions = {}) {
    super();
    this._options = {
      threshold: options.threshold ?? DEFAULT_OPTIONS.threshold,
      alertCooldown: options.alertCooldown ?? DEFAULT_OPTIONS.alertCooldown,
      minConfidence: options.minConfidence ?? DEFAULT_OPTIONS.minConfidence,
      videoConstraints:
        options.videoConstraints ?? DEFAULT_OPTIONS.videoConstraints,
    };
  }

  /** Whether the detector is currently running. */
  get isRunning(): boolean {
    return this._running;
  }

  /**
   * Start the webcam stream and pose-detection loop.
   * Resolves when the camera and model are ready.
   * Throws (and emits `"error"`) if setup fails.
   */
  async start(): Promise<void> {
    if (this._running) return;
    try {
      await this._setupCamera();
      await this._loadModel();
      this._running = true;
      this._scheduleNextFrame();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Stop the detection loop and release all resources (camera, animation
   * frame).  The underlying TF.js model is kept alive; call `dispose()` to
   * release it too.
   */
  stop(): void {
    this._running = false;
    if (this._animationId !== null) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
    if (this._stream) {
      this._stream.getTracks().forEach((t) => t.stop());
      this._stream = null;
    }
    if (this._videoEl) {
      this._videoEl.srcObject = null;
      this._videoEl = null;
    }
  }

  /**
   * Stop detection and dispose of the TF.js model and all event listeners.
   * Call this when you are done with the detector to free GPU memory.
   */
  dispose(): void {
    this.stop();
    if (this._detector) {
      this._detector.dispose();
      this._detector = null;
    }
    this.removeAllListeners();
  }

  /**
   * Dynamically update the slouch-detection threshold without restarting.
   * @param value - New vertical-distance threshold in pixels.
   */
  setThreshold(value: number): void {
    this._options.threshold = value;
  }

  /**
   * Dynamically update the alert cooldown without restarting.
   * @param ms - New cooldown in milliseconds.
   */
  setAlertCooldown(ms: number): void {
    this._options.alertCooldown = ms;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private async _setupCamera(): Promise<void> {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error(
        "navigator.mediaDevices.getUserMedia is not available in this environment."
      );
    }

    this._stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: this._options.videoConstraints,
    });

    const video = document.createElement("video");
    video.srcObject = this._stream;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = reject;
    });

    await video.play();
    this._videoEl = video;
  }

  private async _loadModel(): Promise<void> {
    // Dynamic imports keep peer deps optional at build time.
    const [tf, poseDetection] = await Promise.all([
      import("@tensorflow/tfjs"),
      import("@tensorflow-models/pose-detection"),
    ]);

    await tf.ready();

    this._detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      }
    );
  }

  private _scheduleNextFrame(): void {
    if (!this._running) return;
    this._animationId = requestAnimationFrame(() => {
      this._detectFrame().finally(() => {
        if (this._running) {
          this._scheduleNextFrame();
        }
      });
    });
  }

  private async _detectFrame(): Promise<void> {
    if (!this._detector || !this._videoEl) return;

    try {
      const poses = await this._detector.estimatePoses(this._videoEl);
      const pose = poses[0];
      if (!pose) return;

      const analysis = analyzePosture(pose.keypoints, {
        threshold: this._options.threshold,
        minConfidence: this._options.minConfidence,
      });

      this.emit("posture-change", analysis);

      if (analysis.status === "slouching") {
        const now = Date.now();
        if (now - this._lastAlertTime > this._options.alertCooldown) {
          this._lastAlertTime = now;
          const alert: PostureAlert = {
            type: "slouching",
            message: "You are slouching! Please sit up straight.",
            timestamp: now,
            analysis,
          };
          this.emit("alert", alert);
        }
      }
    } catch (err) {
      this.emit(
        "error",
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }
}
