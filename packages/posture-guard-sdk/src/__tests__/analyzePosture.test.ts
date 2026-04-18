import { describe, it, expect } from "vitest";
import { analyzePosture } from "../analyzePosture.js";

// Helper to construct a realistic keypoints array.
function makeKeypoints(opts: {
  noseY?: number;
  leftShoulderY?: number;
  rightShoulderY?: number;
  score?: number;
} = {}) {
  const score = opts.score ?? 0.9;
  return [
    { name: "nose", x: 320, y: opts.noseY ?? 200, score },
    { name: "left_shoulder", x: 280, y: opts.leftShoulderY ?? 350, score },
    {
      name: "right_shoulder",
      x: 360,
      y: opts.rightShoulderY ?? 350,
      score,
    },
    { name: "left_eye", x: 300, y: 185, score },
    { name: "right_eye", x: 340, y: 185, score },
  ];
}

describe("analyzePosture", () => {
  describe("status classification", () => {
    it('returns "good" when vertical distance exceeds default threshold', () => {
      // shoulderMidpointY=350, noseY=200 → distance=150 > 100
      const result = analyzePosture(
        makeKeypoints({ noseY: 200, leftShoulderY: 350, rightShoulderY: 350 })
      );
      expect(result.status).toBe("good");
    });

    it('returns "slouching" when vertical distance is below default threshold', () => {
      // shoulderMidpointY=350, noseY=280 → distance=70 < 100
      const result = analyzePosture(
        makeKeypoints({ noseY: 280, leftShoulderY: 350, rightShoulderY: 350 })
      );
      expect(result.status).toBe("slouching");
    });

    it('returns "slouching" exactly at threshold boundary (distance === threshold)', () => {
      // distance=100, threshold=100 → distance < threshold is false → good
      // distance=99 → slouching
      const good = analyzePosture(
        makeKeypoints({ noseY: 250, leftShoulderY: 350, rightShoulderY: 350 })
      );
      expect(good.status).toBe("good"); // 350-250=100, not < 100

      const slouching = analyzePosture(
        makeKeypoints({ noseY: 251, leftShoulderY: 350, rightShoulderY: 350 })
      );
      expect(slouching.status).toBe("slouching"); // 350-251=99 < 100
    });
  });

  describe("unknown status", () => {
    it('returns "unknown" for an empty keypoints array', () => {
      const result = analyzePosture([]);
      expect(result.status).toBe("unknown");
      expect(result.verticalDistance).toBeNull();
      expect(result.shoulderMidpointY).toBeNull();
      expect(result.noseY).toBeNull();
      expect(result.confidence).toBe(0);
    });

    it('returns "unknown" when required keypoints are missing', () => {
      const result = analyzePosture([
        { name: "left_eye", x: 300, y: 185, score: 0.9 },
      ]);
      expect(result.status).toBe("unknown");
    });

    it('returns "unknown" when keypoint confidence is below minConfidence', () => {
      const result = analyzePosture(makeKeypoints({ score: 0.3 }));
      expect(result.status).toBe("unknown");
    });
  });

  describe("geometric calculations", () => {
    it("reports correct verticalDistance", () => {
      const result = analyzePosture(
        makeKeypoints({ noseY: 200, leftShoulderY: 340, rightShoulderY: 360 })
      );
      // shoulderMidpointY = (340+360)/2 = 350; distance = 350-200 = 150
      expect(result.verticalDistance).toBe(150);
      expect(result.shoulderMidpointY).toBe(350);
      expect(result.noseY).toBe(200);
    });

    it("reports confidence as the minimum of the three keypoint scores", () => {
      const keypoints = [
        { name: "nose", x: 320, y: 200, score: 0.8 },
        { name: "left_shoulder", x: 280, y: 350, score: 0.7 },
        { name: "right_shoulder", x: 360, y: 350, score: 0.95 },
      ];
      const result = analyzePosture(keypoints);
      expect(result.confidence).toBe(0.7);
    });
  });

  describe("custom options", () => {
    it("respects a custom threshold", () => {
      // distance=150; with threshold=200 this should be slouching
      const result = analyzePosture(
        makeKeypoints({ noseY: 200, leftShoulderY: 350, rightShoulderY: 350 }),
        { threshold: 200 }
      );
      expect(result.status).toBe("slouching");
    });

    it("respects a custom minConfidence", () => {
      // score=0.3 normally causes "unknown", but minConfidence=0.2 allows it
      const result = analyzePosture(
        makeKeypoints({
          score: 0.3,
          noseY: 200,
          leftShoulderY: 350,
          rightShoulderY: 350,
        }),
        { minConfidence: 0.2 }
      );
      expect(result.status).not.toBe("unknown");
      expect(result.confidence).toBe(0.3);
    });
  });

  describe("extra/unknown keypoints", () => {
    it("ignores keypoints that are not used for posture calculation", () => {
      const kps = [
        ...makeKeypoints({ noseY: 200, leftShoulderY: 350, rightShoulderY: 350 }),
        { name: "left_knee", x: 200, y: 600, score: 0.95 },
        { name: "right_knee", x: 400, y: 600, score: 0.95 },
      ];
      const result = analyzePosture(kps);
      expect(result.status).toBe("good");
      expect(result.verticalDistance).toBe(150);
    });
  });
});
