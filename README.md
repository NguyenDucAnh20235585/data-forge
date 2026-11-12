# Data Forge

A simple fullstack application for generating fake data for development and testing.
Built as a personal project to practice fullstack development, API integration, and basic application security.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Data Generation:** Faker.js

## Features

- Quick generation with predefined presets
- Custom generation with 18 field types
- Configurable fields and record counts
- Data preview
- Export to JSON and CSV
- English, Vietnamese, and Japanese support
- Responsive interface

## Getting Started

Clone the repository and install dependencies.

**Backend**

```bash
cd backend
npm install
npm run start:dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:3000`.

## Configuration

For production environments:

- `VITE_API_URL` — Backend API URL
- `CORS_ORIGIN` — Allowed frontend origin
  Local development uses default localhost settings.

## Notes

The backend includes input validation, generation limits, rate limiting, and response size protection.
This project is still being improved as part of my learning process.
