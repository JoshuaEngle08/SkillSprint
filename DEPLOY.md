Build & Deployment Guide

Local build
1. From project root run:
   - `npm ci`
   - `npm run build`
2. `dist/` will contain production-ready HTML and minified assets (`style.min.css`, `script.min.js`).

Server (chat proxy)
1. Change to `server/` folder and copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` in `.env` for real AI responses.
3. Run:
   - `npm ci`
   - `npm start`
4. The server listens on `PORT` (default 3000) and serves the static site plus `/api/chat`.

GitHub Pages (static site)
- Push to `main` and GitHub Action `.github/workflows/deploy-pages.yml` will run the build and deploy `dist/` to GitHub Pages.

Server deploy (Heroku template)
- Add `HEROKU_API_KEY` and `HEROKU_APP_NAME` in your repo secrets to enable `.github/workflows/deploy-server.yml` to push the server to Heroku.

Notes
- The chat widget defaults to a canned response until you configure `OPENAI_API_KEY` and the server endpoint.
- If you want I can create a repo and set up deployments for you.