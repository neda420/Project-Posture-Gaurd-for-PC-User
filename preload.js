/**
 * preload.js – Electron preload script
 *
 * Runs in the renderer's context but has access to Node.js APIs.
 * `contextBridge.exposeInMainWorld` is the ONLY safe way to expose
 * functionality to the renderer while keeping contextIsolation enabled.
 *
 * SECURITY: Do NOT expose `ipcRenderer` directly.  Only expose narrow,
 * well-typed functions so the renderer cannot call arbitrary IPC channels.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("postureGuardAPI", {
  /**
   * Notify the main process that a slouching posture was detected so it can
   * display a native desktop notification.
   */
  triggerAlert: () => {
    ipcRenderer.send("trigger-alert");
  },

  /**
   * Register a callback that fires when the main process confirms the alert
   * was shown (useful for UI state management).
   * @param {(data: unknown) => void} callback
   */
  onAlertShown: (callback) => {
    // Validate that callback is actually a function.
    if (typeof callback !== "function") return;
    ipcRenderer.on("alert-shown", (_event, data) => callback(data));
  },

  /** Remove all `alert-shown` listeners (call on component unmount). */
  removeAlertListeners: () => {
    ipcRenderer.removeAllListeners("alert-shown");
  },
});
