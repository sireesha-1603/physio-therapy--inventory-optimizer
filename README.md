# PhysioFlow — Demand, Inventory & Procurement Optimiser

Enterprise operations workspace for a physiotherapy chain. It uses React/Vite for the responsive dashboard and Node/Express/MongoDB for the secured REST API.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY`.
2. Run `npm install` in both `frontend` and `backend`.
3. Start MongoDB, then run `npm run dev` in `backend` and `npm run dev` in `frontend`.

To populate a local development database with an initial administrator and sample inventory, run `npm run seed` from `backend`. The development account is `admin@physioflow.local` with password `ChangeMe!2026`; change or remove it before deployment.

## API

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `GET|POST /api/v1/inventory/items`
- `GET /api/v1/analytics/dashboard`

All non-auth API routes require `Authorization: Bearer <JWT>`. The server applies Helmet, CORS allow-listing, JSON body limits, rate limits, Zod validation and role checks. Gemini is intentionally accessed only through a backend service.
