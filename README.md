<div align="center">
  <img src="https://via.placeholder.com/150x150/1a1a2e/ffffff?text=Guard" alt="PostureGuard Logo" width="120" />
  <h1>PostureGuard 🧘‍♂️</h1>
  <p><strong>Maintain perfect posture and boost productivity with AI.</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
  [![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
</div>

<br />

PostureGuard is a cross-platform desktop application built for remote workers, developers, and students. By leveraging the power of **TensorFlow.js** directly on your device, it monitors your posture in real-time without sending any video data to the cloud.

If you slouch or lean too far into the screen, PostureGuard will send a native desktop notification reminding you to sit up straight!

## ✨ Features

- **Real-Time Pose Tracking**: Uses `tfjs` and MoveNet to track your shoulders, eyes, and nose.
- **Privacy First**: All machine learning runs purely on your local machine. No images are saved or transmitted.
- **Pomodoro Timer**: Integrated task management to remind you to take breaks.
- **Native Experience**: Packaged with Electron to provide native desktop notifications and an immersive dark-mode UI.
- **Auto-Start**: Can be configured to run automatically when your computer starts.

## 🚀 Installation & SDK Setup

To use PostureGuard locally or develop it further:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/neda420/PostureGuard.git
   cd PostureGuard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application in Development Mode:**
   ```bash
   npm run dev:electron
   ```

### Building the Executable (SDK/App)

To build the downloadable `.exe` (or `.dmg`/`.AppImage`):

```bash
npm run build:electron
```
The compiled executable will be located in the `dist` folder. Simply double-click to install!

## 🧠 Architecture

PostureGuard is built on a modern, robust stack tailored for desktop applications:

* **Frontend UI**: Next.js (React)
* **Desktop Shell**: Electron (with `electron-builder` for distribution)
* **Machine Learning**: `@tensorflow/tfjs` + `@tensorflow-models/pose-detection`
* **Local Database**: Prisma ORM with SQLite (for saving settings and Pomodoro stats locally)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Inspired by the need for better ergonomics in the digital age.*
