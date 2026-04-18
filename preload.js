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

// Keep a reference to the registered alert-shown listener so we can remove
// exactly that one function on cleanup rather than wiping all listeners on the
// channel (which would affect any other consumers of the same event).
let _alertShownListener = null;

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
    // Remove any previously registered listener before adding a new one so
    // that repeated calls (e.g. React StrictMode double-mount) do not stack.
    if (_alertShownListener) {
      ipcRenderer.removeListener("alert-shown", _alertShownListener);
    }
    _alertShownListener = (_event, data) => callback(data);
    ipcRenderer.on("alert-shown", _alertShownListener);
  },

  /** Remove the `alert-shown` listener registered by `onAlertShown` (call on component unmount). */
  removeAlertListeners: () => {
    if (_alertShownListener) {
      ipcRenderer.removeListener("alert-shown", _alertShownListener);
      _alertShownListener = null;
    }
  },
});
