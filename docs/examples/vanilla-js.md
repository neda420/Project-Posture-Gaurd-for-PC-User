# Example – Vanilla JS

A minimal browser-only integration using a `<script type="module">` tag.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PostureGuard Demo</title>
</head>
<body>
  <h1>PostureGuard – Vanilla JS</h1>
  <p id="status">Loading…</p>
  <button id="stop" disabled>Stop</button>

  <script type="module">
    // Bundler (Vite/esbuild) required to resolve npm imports.
    import { PostureDetector } from "posture-guard-sdk";

    const statusEl = document.getElementById("status");
    const stopBtn  = document.getElementById("stop");

    const detector = new PostureDetector({
      threshold: 110,
      alertCooldown: 8000,
    });

    detector.on("posture-change", ({ status }) => {
      statusEl.textContent = `Posture: ${status}`;
      statusEl.style.color = status === "good" ? "green" : status === "slouching" ? "red" : "grey";
    });

    detector.on("alert", (alert) => {
      // Browser Notifications API (requires permission)
      if (Notification.permission === "granted") {
        new Notification("PostureGuard", { body: alert.message });
      } else {
        console.warn(alert.message);
      }
    });

    detector.on("error", (err) => {
      statusEl.textContent = `Error: ${err.message}`;
    });

    await Notification.requestPermission();
    await detector.start();

    stopBtn.disabled = false;
    stopBtn.addEventListener("click", () => {
      detector.dispose();
      statusEl.textContent = "Stopped.";
      stopBtn.disabled = true;
    });
  </script>
</body>
</html>
```

> **Note:** You need a bundler (Vite, esbuild, Parcel) to resolve `posture-guard-sdk` from `node_modules`.  
> Run `npm create vite@latest` for a quick project scaffold.
