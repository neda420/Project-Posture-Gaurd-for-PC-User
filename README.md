<div align="center">
  
  <h1>PostureGuard 🧘‍♂️</h1>
  <p><strong>Maintain perfect posture and boost productivity with AI.</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![npm version](https://img.shields.io/npm/v/posture-guard-sdk)](https://www.npmjs.com/package/posture-guard-sdk)
  [![CI](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/actions/workflows/ci.yml/badge.svg)](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/actions/workflows/ci.yml)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
  [![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
</div>

<br />

PostureGuard is a cross-platform desktop application **and** an npm SDK built for remote workers, developers, and students. By leveraging the power of **TensorFlow.js** directly on your device, it monitors your posture in real-time without sending any video data to the cloud.

If you slouch or lean too far into the screen, PostureGuard will send a native desktop notification reminding you to sit up straight!

## ✨ Features

- **Real-Time Pose Tracking**: Uses `tfjs` and MoveNet to track your shoulders, eyes, and nose.
- **Privacy First**: All machine learning runs purely on your local machine. No images are saved or transmitted.
- **Pomodoro Timer**: Integrated task management to remind you to take breaks.
- **Native Experience**: Packaged with Electron to provide native desktop notifications and an immersive dark-mode UI.
- **Auto-Start**: Can be configured to run automatically when your computer starts.
- **npm SDK**: Use `posture-guard-sdk` in any React, Vue, Svelte, or vanilla JS project.

---

## 📦 Install the SDK

Add posture detection to any web or Electron project in seconds:

### One-click SDK setup (Windows PC)

Download and run this setup file to auto-install the SDK and required dependencies:

➡️ **[Download SDK Setup File (.bat)](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/raw/master/scripts/windows/PostureGuard-SDK-Setup.bat)**

If your browser shows script text, use **Right click → Save link as...** and save it as `PostureGuard-SDK-Setup.bat`, then double-click the saved file.

After running the file, it will automatically:
- create a local starter folder
- install `posture-guard-sdk`
- install required TensorFlow dependencies

### Manual npm install

```bash
npm install posture-guard-sdk @tensorflow/tfjs @tensorflow-models/pose-detection
```

```ts
import { PostureDetector } from "posture-guard-sdk";

const detector = new PostureDetector({ threshold: 120 });

detector.on("alert", (alert) => {
  console.warn(alert.message); // "You are slouching!"
});

await detector.start();
```

→ See [docs/QUICK_START.md](docs/QUICK_START.md) and the [full API reference](docs/API.md).

---

## 🖥️ Download for Windows

Download the latest Windows installer from GitHub Releases:

➡️ **[Download PostureGuard for Windows (.exe)](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/releases/latest)**

### Note for Windows Users

Because this installer is not code-signed yet, Windows SmartScreen may show an **"Unknown Publisher"** warning.  
To continue:
1. Click **More info**
2. Click **Run anyway**

---

## 🚀 Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) v9+

### Getting Started

```bash
git clone https://github.com/neda420/Project-Posture-Gaurd-for-PC-User.git
cd Project-Posture-Gaurd-for-PC-User

# Install root app dependencies
npm install

# Install & build the SDK
cd packages/posture-guard-sdk && npm install && npm run build && cd ../..

# Run the desktop app in development mode
npm run dev:electron
```

### Building the desktop installer

```bash
npm run build:electron
# Output: dist/PostureGuard-Setup-*.exe
```

### Working on the SDK

```bash
cd packages/posture-guard-sdk

npm run lint       # TypeScript type-check
npm test           # unit tests (Vitest)
npm run build      # ESM + CJS + type declarations
```

---

## 🏗️ Architecture

```
.
├── src/                       # Next.js + Electron UI (desktop app)
│   ├── app/                   # Next.js App Router pages & styles
│   └── components/            # React components (PostureCamera, etc.)
├── packages/
│   └── posture-guard-sdk/     # ← publishable npm SDK
│       ├── src/
│       │   ├── analyzePosture.ts   # pure posture logic
│       │   ├── PostureDetector.ts  # high-level detector class
│       │   ├── EventEmitter.ts     # typed event emitter
│       │   └── types.ts            # TypeScript types
│       └── dist/              # generated (ESM + CJS + .d.ts)
├── main.js                    # Electron main process (secure)
├── preload.js                 # contextBridge IPC bridge
└── docs/                      # API reference & usage examples
```

**Stack:**
* **Frontend UI**: Next.js 16 (React 19)
* **Desktop Shell**: Electron 41 with `electron-builder`
* **Machine Learning**: `@tensorflow/tfjs` + `@tensorflow-models/pose-detection` (MoveNet)
* **SDK Build**: `tsup` (ESM + CJS + TypeScript declarations)
* **Testing**: Vitest

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a Pull Request against `main`

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

*Inspired by the need for better ergonomics in the digital age.*
