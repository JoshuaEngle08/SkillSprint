# SkillSprint — Website

This project is a lightweight, responsive brochure site for SkillSprint (web design & development). It is built with vanilla HTML, CSS, and JavaScript.

Quick setup
1. Open `index.html` in a browser to preview locally.

Form setup
- Create a free form at https://formspree.io and replace `yourFormId` in the contact `<form>` `action` and `data-formspree-endpoint` attributes.

Analytics
- Replace the placeholder `G-XXXXXXX` in the `<head>` with your Google Analytics (GA4) Measurement ID to enable gtag.
- Visitors must accept the consent banner to enable GA.

Server (chat proxy)
- A simple Node.js server is included in the `server/` folder with a `/api/chat` endpoint. Copy `server/.env.example` to `server/.env` and set `OPENAI_API_KEY` to enable real AI responses. Optionally set `OPENAI_MODEL=gpt-4` (recommended) to use GPT-4 — note that GPT-4 may incur higher usage costs. Run `npm install` and `npm start` inside `server/` to start the chat proxy.

GitHub automation & repository setup
- I included helper scripts to create a GitHub repo and set secrets using the GitHub CLI (`gh`). These are in `scripts/` and require `gh` to be authenticated locally. Use `scripts/create_repo.sh <repo-name>` to create the repository and push the initial commit, and `scripts/set_secrets.sh` to set `OPENAI_API_KEY`, `OPENAI_MODEL`, `HEROKU_API_KEY`, and `HEROKU_APP_NAME` as GitHub Actions secrets.

Pages
- The site now has separate pages: `index.html`, `services.html`, `pricing.html`, `portfolio.html`, `about.html`, and `contact.html` for better UX and SEO.

Portfolio & CMS
- The portfolio was enhanced with a filterable gallery, lightbox modal, and links to project case studies (`project-1.html`, `project-2.html`, `project-3.html`).
- You can manage projects via Netlify CMS by placing the `admin/` folder on your deploy and enabling the `git-gateway` backend (or choose another backend). The CMS config is `admin/config.yml` and stores projects in `content/projects` by default.

To enable Netlify CMS:
1. Deploy the site to Netlify.
2. Enable Identity in the Netlify dashboard and turn on Git Gateway.
3. Visit `/admin` and sign in to manage `Projects`.

If you'd like, I can integrate CMS with your Netlify account or adapt the CMS config for Forestry/other CMS providers.

Files added
- `index.html`, `style.css`, `script.js` — main site
- `services.html`, `pricing.html`, `portfolio.html`, `about.html`, `contact.html` — separate pages
- `robots.txt`, `sitemap.xml` — SEO helpers
- `server/` — minimal chat proxy

Deployment
- This site is static and can be deployed to Netlify, Vercel, GitHub Pages, or any static host. If using the chat proxy, deploy the server (Heroku, Render, Vercel Serverless, etc.) and set `data-chat-endpoint` on the chat widget to the deployed endpoint.

Accessibility & performance
- Mobile-first design
- Lazy loading for images
- Form validation and accessible status messages

If you want, I can add a tiny build step (minify + autoprefix) and a deploy script for automatic deploys. Tell me which hosting provider you'd like to target.