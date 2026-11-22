# Deploying the CA CDL Class A Study app (static site)

Upload everything in this folder (including the hidden `.nojekyll`) to any static host. All paths are relative, so the app works at the domain root (`https://example.com/`) or in a subfolder (`https://example.com/cdl/`).

- `index.html` – the whole app (questions, explanations, Evidence, study tools). Works offline after the first visit.
- `sw.js` – service worker (cache `ca-cdl-study-v28`). Bump the cache name whenever `index.html` changes so returning users get the update.
- `manifest.webmanifest`, `icons/` – install-to-home-screen support.
- `404.html` – friendly not-found page that finds the app folder and redirects to it (GitHub Pages and Netlify use it automatically; on Cloudflare Pages it is used as the 404 page too).
- `diagrams/` – stand-alone copies of the study diagrams (the app has them built in).
- `fonts/` – the Atkinson Hyperlegible and OpenDyslexic font files and their SIL Open Font License texts. The app has these fonts built into `index.html` (so they work offline); the files are here for the license and for reuse.

Hosts: GitHub Pages (push to a branch, enable Pages), Netlify or Cloudflare Pages (drag and drop the folder), or any web server. Serve over HTTPS so offline mode and install work.

- `version.json` – current version (`{"v":"v28"}`). The service worker never caches it; copies of the app opened outside the live site (single HTML file, APK) read it to show an update banner. Bump it with every release.
