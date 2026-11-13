# Data Forge

A simple fullstack fake data generator for development and testing. Built as a personal project to practice fullstack development and application security.

**Live demo:** https://data-forge-e67e.vercel.app/

## Features

- Quick generation with predefined presets
- Custom generation with 18 field types
- Configurable fields and record counts
- Data preview and JSON/CSV export
- English, Vietnamese, and Japanese support
- Responsive interface and input validation

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Data generation:** Faker.js

## Run Locally

Start the backend:

```bash
cd backend
npm install
npm run start:dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:3000

## Configuration

- `VITE_API_URL`: backend API URL used by the frontend at build time
- `CORS_ORIGIN`: allowed frontend origin(s) for the backend

Local development uses localhost defaults. The demo is deployed on Vercel.
