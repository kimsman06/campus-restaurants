# Gemini Code Assistant Context

## Project Overview

This is a "Campus Restaurant Map" web application. The goal is to help users discover and explore restaurants around a campus. The project is a monorepo with a React frontend and an Express.js backend.

**Frontend (client/):**
- **Framework:** React with Vite
- **Routing:** `react-router-dom`
- **Data Fetching:** `axios` and `@tanstack/react-query`
- **Styling:** Emotion, `react-icons`

**Backend (server/):**
- **Framework:** Express.js
- **Middleware:** `cors`
- **Testing:** Jest, Supertest

## Building and Running

### Client (Frontend)

- **Install Dependencies:** `npm install` in the `client` directory.
- **Run Development Server:** `npm run dev` in the `client` directory.
- **Build for Production:** `npm run build` in the `client` directory.
- **Lint:** `npm run lint` in the `client` directory.

### Server (Backend)

- **Install Dependencies:** `npm install` in the `server` directory.
- **Run Development Server:** `npm run dev` in the `server` directory.
- **Start Server:** `npm run start` in the `server` directory.
- **Run Tests:** `npm run test` in the `server` directory.

## Development Conventions

- The project follows a standard monorepo structure with separate `client` and `server` directories.
- The frontend code is organized into `components`, `pages`, `services`, and `styles`.
- The backend code is organized into `controllers`, `data`, `middleware`, `models`, `routes`, and `services`.
- The backend uses a `restaurants.json` file for data, indicating that a database has not yet been integrated.
- API endpoints are defined in the `server/src/routes` directory.
- Business logic is separated into `services` on the backend.
