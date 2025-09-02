## Nayna AI Frontend

React + TypeScript app scaffolded with Vite config and Tailwind.

Setup:
- Install Node.js LTS
- Run `npm install`
- Run `npm run dev`

Env:
- `VITE_API_BASE_URL` for backend base URL

Deploy to Vercel:
1) Install Node.js and Vercel CLI: `npm i -g vercel`
2) From `nayna-ai-frontend/`, run `npm install`
3) Create `.env` (or set env in Vercel project settings):
   - `VITE_API_BASE_URL=https://your-backend.example.com`
4) Add SPA rewrite for React Router (already included): `vercel.json`
5) Build locally to verify: `npm run build`
6) Deploy:
   - First time: `vercel` (follow prompts, scope the project to this folder)
   - Subsequent: `vercel --prod`

Vercel settings:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

GitHub Actions (auto-deploy):
1) Push this repo to GitHub.
2) In GitHub → Repo → Settings → Secrets and variables → Actions, add:
   - `VERCEL_TOKEN`: Vercel Personal Token
   - `VERCEL_ORG_ID`: Your Vercel org ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VITE_API_BASE_URL`: Your API URL for production
3) Ensure default branch is `main`. On push to `main` under `nayna-ai-frontend/`, the workflow will build and deploy.

Pages:
- Auth, Instances, Instance Details (Hosts, Venue, Event, Guests)

