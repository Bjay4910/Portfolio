# Barnabas James Gyampoh - Portfolio

Personal portfolio of Barnabas James Gyampoh, Computer Science & Applied Mathematics student and developer (Thomas College, graduating December 2026).

Live: [https://bjay4910.github.io/Portfolio/](https://bjay4910.github.io/Portfolio/)

## Stack

- Static HTML, CSS and vanilla JavaScript. No framework, no build step, no CDNs, trackers or analytics.
- System font stack; project visuals are inline SVG and CSS gradients.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` (pushes the repo root to `gh-pages` on every push to `main`).

## Structure

- `index.html` - the single page (hero, about, experience, projects, skills, education, leadership, contact)
- `css/styles.css` - design tokens, layout and responsive rules
- `js/main.js` - mobile nav, active-section highlight, reveal-on-scroll (respects `prefers-reduced-motion`)
- `images/profile-560.jpg` - web-sized profile photo (original kept at `images/profilepic.png`)
- `assets/Barnabas_Gyampoh_Resume_Full.pdf` - resume linked from the page (add the file here)

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## Contact

james.b.gyampoh@gmail.com
