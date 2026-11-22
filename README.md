# Barnabas James Gyampoh - Portfolio

Personal portfolio of Barnabas James Gyampoh, Computer Science & Applied Mathematics student and developer (Thomas College, graduating December 2026).

Live: [https://bjay4910.github.io/Portfolio/](https://bjay4910.github.io/Portfolio/)

## Stack

- Static HTML, CSS and vanilla JavaScript. No framework, no build step, no runtime requests to any other host (no CDNs, hosted fonts, trackers or analytics).
- System font stack; project visuals and architecture diagrams are hand-written inline SVG themed with CSS variables.
- Hero: a 3D node network drawn with Canvas 2D and a manual perspective projection (`js/hero.js`, no library). It loads only on desktop (>= 768px wide, fine pointer, no reduced-motion preference) and pauses when the tab is hidden or the hero is off-screen.
- Dark theme by default, light theme via `prefers-color-scheme` or the toggle (saved in `localStorage`). Command palette: Ctrl/Cmd + K.
- Works with JavaScript disabled: all content is in the HTML; scripts only enhance.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` (pushes the repo root to `gh-pages` on every push to `main`).

## Structure

- `index.html` - the single page (hero, about, experience, projects, skills, education, leadership, contact)
- `css/styles.css` - design tokens, layout and responsive rules
- `js/main.js` - nav, theme, command palette, project filter and detail dialog, counters, timeline, cursor glow, tilt, parallax
- `js/hero.js` - Canvas 2D hero scene (desktop only)
- `site.config.js` - demo and repository URLs (see below)
- `images/og.png` - Open Graph image, rendered from `tools/og-image.html` with headless Chromium at 1200x630
- `images/profile-560.jpg` - web-sized profile photo (original kept at `images/profilepic.png`)

## Demo and repo links (`site.config.js`)

```js
window.SITE_CONFIG = {
    demos: { powerManager: "", memoryHub: "", vigil: "", lyra: "", syncscript: "" },
    repos: { powerManager: "https://github.com/...", memoryHub: "https://github.com/...", lyra: "", vigil: "", syncscript: "" }
};
```

- Put an `https://` URL in `demos.<project>` to show a demo button on that card and in its detail dialog. Empty strings hide the button.
- `demoLabels.<project>` sets the button text: it defaults to **Watch demo** (videos); SyncScript uses **Live demo** because it links to the running app.
- Put an `https://` URL in `repos.<project>` to add a **GitHub** button to a card that does not already have one.
- Project dialogs are linkable: `#project-power-manager`, `#project-memory-hub`, `#project-lyra`, `#project-vigil`, `#project-syncscript`.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## Resume

The resume is not published in this repository. It is shared on request: the **Request my resume** buttons (hero, About and the command palette) open a pre-filled email (subject "Resume request"). PDFs matching `*Resume*.pdf`, `*resume*.pdf`, `*CV*.pdf` and `assets/*.pdf` are git-ignored so a copy is not committed by accident.

## Contact

james.b.gyampoh@gmail.com
