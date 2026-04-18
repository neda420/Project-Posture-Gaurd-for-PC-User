"use client";

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

export default function PostureCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postureStatus, setPostureStatus] = useState("Good");

  useEffect(() => {
    let detector: poseDetection.PoseDetector | null = null;
    let animationId: number;

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve(videoRef.current);
        });
        videoRef.current.play();
      }
    };

    const loadPoseNet = async () => {
      await tf.ready();
      detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      setIsLoaded(true);
    };

    const detectPose = async () => {
      if (detector && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const poses = await detector.estimatePoses(video);
        
        // Draw to canvas
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (poses.length > 0) {
            const keypoints = poses[0].keypoints;
            
            // Posture evaluation logic (simplified)
            // Calculate distance between shoulders and nose
            const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
            const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
            const nose = keypoints.find((k) => k.name === "nose");

            if (leftShoulder && rightShoulder && nose && leftShoulder.score! > 0.5 && rightShoulder.score! > 0.5) {
               const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
               // If nose drops too close to shoulders or shoulders become asymmetrical, alert
               const verticalDistance = shoulderY - nose.y;

               if (verticalDistance < 100) { // arbitrary threshold for leaning/slouching
                  setPostureStatus("Slouching");
                  
                  // Use the secure contextBridge API injected by preload.js.
                  // This replaces the unsafe `window.require('electron')` pattern.
                  const win = window as unknown as { postureGuardAPI?: { triggerAlert: () => void } };
                  if (typeof window !== "undefined" && win.postureGuardAPI) {
                    win.postureGuardAPI.triggerAlert();
                  }
               } else {
                  setPostureStatus("Good");
               }
            }

            // Draw keypoints
            keypoints.forEach((keypoint) => {
              if (keypoint.score && keypoint.score > 0.5) {
                ctx.beginPath();
                ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "aqua";
                ctx.fill();
              }
            });
          }
        }
      }
      animationId = requestAnimationFrame(detectPose);
    };

    const init = async () => {
      try {
        await setupCamera();
        await loadPoseNet();
        detectPose();
      } catch (err) {
        console.error("Camera/PoseNet error: ", err);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (detector) {
        detector.dispose();
      }
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!isLoaded && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white" }}>
          Loading AI Model...
        </div>
      )}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width={640}
        height={480}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
          transform: "scaleX(-1)", // Mirror the webcam feed
        }}
      />
      
      {isLoaded && (
         <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            borderRadius: '20px',
            background: postureStatus === 'Good' ? 'rgba(50, 205, 50, 0.8)' : 'rgba(255, 76, 76, 0.8)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
         }}>
            Status: {postureStatus}
         </div>
      )}
    </div>
  );
}
