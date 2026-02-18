# DermAI (Vite + React)

## Prerequisites

- Node.js: `^20.19.0 || >=22.12.0` (required by Vite 7)
- npm

## Run locally

```bash
npm ci
cp .env.example .env # optional
npm run dev
```

## Backend API

The frontend posts a `multipart/form-data` request to:

- `${VITE_API_BASE_URL}/predict` (defaults to `http://localhost:8000/predict`)

Set `VITE_API_BASE_URL` in `.env` if your backend is on a different host/port.

## Common issues

- `sh: vite: command not found`: dependencies weren’t installed; run `npm ci`.
- `ENOTFOUND registry.npmjs.org`: npm can’t reach the package registry (DNS/network/proxy issue).
