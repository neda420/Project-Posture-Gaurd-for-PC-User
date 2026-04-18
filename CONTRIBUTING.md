# Contributing to PostureGuard

Thank you for your interest in contributing! Every bug report, idea, and pull request is valued.

## Table of contents

- [Code of Conduct](#code-of-conduct)
- [Getting started](#getting-started)
- [Repository structure](#repository-structure)
- [Development workflow](#development-workflow)
- [Submitting a pull request](#submitting-a-pull-request)
- [Commit message format](#commit-message-format)
- [Versioning policy](#versioning-policy)
- [Reporting security vulnerabilities](#reporting-security-vulnerabilities)

---

## Code of Conduct

Please be respectful and constructive in all interactions.  We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting started

### Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Node.js | 18 |
| npm | 9 |
| Git | 2.x |

### Clone and install

```bash
git clone https://github.com/neda420/Project-Posture-Gaurd-for-PC-User.git
cd Project-Posture-Gaurd-for-PC-User

# Install root app dependencies
npm install

# Install SDK dependencies (separate package)
cd packages/posture-guard-sdk && npm install && cd ../..
```

---

## Repository structure

```
.
├── src/                      # Next.js + Electron UI (the desktop app)
│   ├── app/                  # Next.js App Router pages
│   └── components/           # React components (e.g. PostureCamera)
├── packages/
│   └── posture-guard-sdk/    # Publishable npm SDK
│       ├── src/              # SDK source (TypeScript)
│       └── dist/             # Generated build artefacts (gitignored)
├── main.js                   # Electron main process
├── preload.js                # Electron contextBridge preload (secure IPC)
├── docs/                     # Developer documentation
│   └── examples/             # Usage examples (vanilla JS, React, Electron)
└── .github/                  # Workflows, issue templates, PR template
```

---

## Development workflow

### Running the desktop app

```bash
npm run dev:electron   # starts Next.js dev server + Electron
```

### Working on the SDK

```bash
cd packages/posture-guard-sdk

npm run lint          # TypeScript type-check
npm test              # run unit tests (Vitest)
npm run build         # build ESM + CJS + type declarations
```

---

## Submitting a pull request

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b fix/describe-your-change
   ```
2. Make your changes and ensure all checks pass:
   ```bash
   # App lint
   npm run lint

   # SDK checks
   cd packages/posture-guard-sdk
   npm run lint && npm test && npm run build
   ```
3. Push your branch and open a pull request against `main`.
4. Fill in the PR template completely.
5. A maintainer will review and merge.

---

## Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`

**Scopes:** `sdk`, `app`, `electron`, `ci`, `docs`

**Examples:**
```
feat(sdk): add setThreshold() method
fix(electron): remove nodeIntegration
docs(sdk): update API reference for v1.1
```

---

## Versioning policy

This project follows [Semantic Versioning](https://semver.org/):

- **PATCH** (`1.0.x`) – Bug fixes, no API changes.
- **MINOR** (`1.x.0`) – New backwards-compatible features.
- **MAJOR** (`x.0.0`) – Breaking API changes.

The SDK (`packages/posture-guard-sdk`) is versioned independently from the desktop app.

---

## Reporting security vulnerabilities

**Please do not open a public GitHub issue for security vulnerabilities.**

Email the maintainer directly at the address in the [LICENSE](LICENSE) or open a [GitHub Security Advisory](https://github.com/neda420/Project-Posture-Gaurd-for-PC-User/security/advisories/new).

We aim to respond within 48 hours and release a patch within 7 days.
