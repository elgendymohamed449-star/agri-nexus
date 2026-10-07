# Agri Nexus Pro

A professional crop protection dashboard inspired by agronomy research platforms, built with a React frontend and an Express API.

## Tech stack

- Frontend: React + Vite
- Backend: Express.js
- Data: Realistic agronomy data for pests, diseases, weeds and active ingredients

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

```txt
http://localhost:3000
```

The frontend uses the API at `http://localhost:5000` through a Vite proxy.

## Production build

```bash
npm run build
```

## API

- `GET /api/health`
- `GET /api/search?q=armyworm`
- `GET /api/records/:id`

## Notes

This project focuses on a realistic agronomy interface and clean architecture for future extension with authentication, database persistence, and advanced analytics.
