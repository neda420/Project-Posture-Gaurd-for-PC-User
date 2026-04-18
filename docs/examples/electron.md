# Example – Electron Integration

This example shows how to use the SDK with Electron's secure IPC model  
(`contextIsolation: true`, `nodeIntegration: false`).

## Architecture overview

```
Renderer process                 Main process
─────────────────────────────    ──────────────────────────────
PostureDetector (SDK)            ipcMain.on("trigger-alert", ...)
    │ "alert" event              │
    ▼                            │
window.postureGuardAPI  ────────►  Native Notification
 .triggerAlert()         IPC
```

## 1. preload.js

```js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("postureGuardAPI", {
  triggerAlert: () => ipcRenderer.send("trigger-alert"),
  onAlertShown: (cb) => ipcRenderer.on("alert-shown", (_e, data) => cb(data)),
  removeAlertListeners: () => ipcRenderer.removeAllListeners("alert-shown"),
});
```

## 2. main.js

```js
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:3000");

  ipcMain.on("trigger-alert", (event) => {
    new Notification({
      title: "PostureGuard 🧘",
      body: "You are slouching! Please sit up straight.",
    }).show();
    event.sender.send("alert-shown", { timestamp: Date.now() });
  });
});
```

## 3. Renderer (React)

```tsx
import { useEffect } from "react";
import { PostureDetector } from "posture-guard-sdk";

export default function PostureCamera() {
  useEffect(() => {
    const detector = new PostureDetector({ threshold: 100 });

    detector.on("alert", () => {
      // Delegate to the main process for a native notification.
      (window as any).postureGuardAPI?.triggerAlert();
    });

    detector.start().catch(console.error);
    return () => detector.dispose();
  }, []);

  return <canvas id="pose-canvas" />;
}
```

## Key security rules

- **Never** use `nodeIntegration: true` – it exposes all of Node.js to the renderer.
- **Never** use `(window as any).require("electron")` – it bypasses the security sandbox.
- **Always** use `contextBridge.exposeInMainWorld` to create a narrow, typed API surface.
- Keep IPC channel names stable and document them (treat them as a public API).
