# Changelog

All notable changes to **PostureGuard** and **posture-guard-sdk** are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### Added
- `posture-guard-sdk` npm package – framework-agnostic posture detection SDK
  - `PostureDetector` class with typed event emitter (`posture-change`, `alert`, `error`)
  - `analyzePosture` pure function for use with any pose-detection source
  - Full TypeScript types and JSDoc documentation
  - ESM + CJS dual build via `tsup`
  - Unit test suite (Vitest, 11 tests)
- Electron security hardening
  - New `preload.js` using `contextBridge` (replaces unsafe `window.require('electron')`)
  - `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
  - IPC reply (`alert-shown`) so the renderer can react to notifications
- GitHub Actions CI pipeline (`ci.yml`) – lint, test, build on Node 18 and 20
- GitHub Actions publish pipeline (`publish.yml`) – npm publish on GitHub release
- GitHub Actions release pipeline (`release.yml`) – Electron distributables for Windows, macOS, Linux
- Issue templates for bug reports and feature requests (GitHub Forms)
- Pull request template with checklist
- `CODEOWNERS` file
- `CONTRIBUTING.md` with development workflow, commit convention, and security policy
- `docs/API.md` – full SDK API reference
- `docs/QUICK_START.md` – zero-to-detection guide
- Usage examples: vanilla JS, React, Electron

### Changed
- Root `package.json` converted to npm workspace monorepo (`packages/*`)
- `PostureCamera.tsx` updated to use `window.postureGuardAPI.triggerAlert()` (secure IPC)

---

## [0.1.0] – 2026-04-18

### Added
- Initial Electron desktop application
- Next.js UI with dashboard, Pomodoro timer, and settings tabs
- TensorFlow.js MoveNet pose detection in `PostureCamera` component
- Native desktop notifications on slouch detection
- Prisma + SQLite local database schema
- Dark-mode UI with `lucide-react` icons
