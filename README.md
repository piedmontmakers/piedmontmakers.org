# piedmontmakers.org

The website of [Piedmont Makers](https://piedmontmakers.org), a 501(c)(3) nonprofit running FIRST Robotics teams, a community engineering lab, the School Maker Faire, popup maker spaces, and Build Like a Girl across the East Bay.

This is a static site built with [Astro](https://astro.build) and Tailwind CSS. It auto-deploys to GitHub Pages every time someone pushes to `main`.

## Quick links

- **Live site**: <https://piedmontmakers.org>
- **Issues & feature requests**: <https://github.com/piedmontmakers/piedmontmakers.org/issues>

## What's where

| Need to edit... | Look in |
|---|---|
| Home page sections | `src/pages/index.astro` |
| About / board roster | `src/pages/about-us.astro` |
| Robotics levels + FAQ | `src/pages/robotics.astro` |
| A specific program page | `src/pages/events/{slug}.astro` |
| Facilities (10th St + Engineering Lab) | `src/pages/facilities.astro` |
| Teacher Grants list | `src/pages/teacher-grants.astro` |
| Calendar of events | `src/content/events/` (one Markdown file per event) |
| Blog posts | `src/content/blog/` (one Markdown file per post) |
| 404 page (with dancing Makey) | `src/pages/404.astro` |
| Photos | `public/img/` (organized by section) |
| Brand colors & fonts | `src/styles/global.css` |
| Analytics events | `src/components/PostHog.astro` + inline scripts on each page |

## Making changes — three options

### Option 1: GitHub web editor (no install needed)

Fastest for small text edits or adding a blog post / event.

1. Open the file on GitHub (e.g. `src/content/blog/2026-04-21-...md`)
2. Click the pencil icon to edit
3. Make your change
4. At the bottom, write a short commit message and click **Commit changes**
5. Wait ~30 seconds — the GitHub Action rebuilds and deploys

### Option 2: Clone locally + edit by hand

```bash
git clone https://github.com/piedmontmakers/piedmontmakers.org.git
cd piedmontmakers.org
npm ci          # prefer over `npm install` — see "Gotchas" below
npm run dev
```

The site runs at <http://localhost:4321/piedmontmakers.org/> with hot reload — open the URL in a browser and your edits show up as you save.

If you need to set up PostHog locally, create a `.env` (gitignored) with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. The site works fine without these — the snippet no-ops if either is missing.

When you're happy:
```bash
git add .
git commit -m "Short description of what changed"
git push
```

### Option 3: Clone locally + use Claude Code

This is how most of the site was built. Claude Code reads `CLAUDE.md` at the repo root and gets full project context — tech stack, voice rules, file map, conventions.

```bash
git clone https://github.com/piedmontmakers/piedmontmakers.org.git
cd piedmontmakers.org
npm install
claude   # or open in the Claude Code IDE plugin
```

Then talk to it: *"Add a new blog post about the spring open house"*, *"Add the FTC league championship to the events calendar for November 15"*, *"Swap the photo on the Maker Faire page"*, etc. Claude will read `CLAUDE.md`, follow the project's conventions, edit the right files, and you can review the changes before committing.

Keep `npm run dev` running in another terminal while you work — Claude will check the browser preview as it edits.

## Adding an event

The events calendar at `/events` reads from Markdown files in `src/content/events/`. To add one:

1. Create a file `src/content/events/YYYY-MM-DD-short-slug.md`
2. Frontmatter looks like this:
   ```yaml
   ---
   title: "FTC League Match #3"
   startDate: 2026-11-08
   startTime: "10:00 AM"
   endTime: "4:00 PM"
   location: "John Morrison Gymnasium"
   program: "robotics"
   summary: "Third league qualifier."
   actions:
     - type: info
       url: "/robotics#ftc"
       label: "About FTC"
   ---
   ```
3. Save, commit, push. The event shows up in Upcoming (or Past, depending on today's date — that split happens client-side, so the page stays accurate forever without rebuilds).

Action types: `tickets`, `register`, `volunteer`, `exhibit`, `info`. Color-coded buttons in the calendar.

## Adding a blog post

Drop a Markdown file in `src/content/blog/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Post title here"
pubDate: 2026-05-19
author: "Piedmont Makers"
excerpt: "One-sentence summary for the listing pages."
heroImage: "/img/blog/slug/hero.jpg"
heroImageAlt: "Alt text for the hero."
heroImageCaption: "Caption."
---

Body in Markdown.
```

Put any photos for the post under `public/img/blog/slug/`. Resize to a reasonable web size first — 1600px wide max is plenty:

```bash
sips --resampleWidth 1600 --setProperty formatOptions 82 \
  "source.jpg" --out public/img/blog/slug/photo.jpg
```

## What's already external (don't touch)

These run on their own services and just get linked from the site:

- **Donations** → Square at `donate.piedmontmakers.org`
- **Newsletter** → Mailchimp (inline form on the home page posts there)
- **T-shirts** → [Bonfire](https://www.bonfire.com/piedmont-makers-t-shirt/)
- **Robotics registration** → TeamSnap (one form per level)
- **Maker Faire tickets** → Eventbrite
- **Forms** (exhibit signup, waiver, check-in) → Google Forms / Grasshopper

## Voice

Short version:
- Audience is **parents across the East Bay**, not just Piedmont
- **Kids and volunteers are the heroes**, not the org
- Keep "Piedmont" in the name and in literal place names; don't use it to scope the audience
- See `CLAUDE.md` for the full set of voice rules

## Tech

Astro 5 (NOT 6 — Astro 6 has a known build issue with our setup), Tailwind CSS v4, `@tailwindcss/typography` for blog prose, content collections for blog + events, PostHog for analytics, a hand-rolled RSS feed at `/rss.xml`. SEO basics (canonical, Open Graph, Twitter Card, JSON-LD, `robots.txt`, `llms.txt`) all wired into `BaseLayout`. Full details in `CLAUDE.md`.

## Gotchas

- **Use `npm ci` over `npm install` when possible.** A regular `npm install` can silently drop the `@rolldown/binding-*` optional deps and break the build (`Cannot find module '@rolldown/binding-darwin-arm64'`). If that happens: `git checkout package-lock.json && rm -rf node_modules && npm ci`. When you do need to add a dep, run `npm ci` first to lock the optional deps in, then `npm install <pkg> --include=optional`.
- **`501(c)(3)` requires a zero-width non-joiner** between `(` and `c`. The body font (Manrope) substitutes `(c)` → © via an OpenType feature that CSS can't reliably disable. Every `501(c)(3)` on the site uses `&zwnj;` in templates or `‌` in TS strings — follow the pattern.
- **Don't `git add -A`.** Use explicit paths (`git add src/...`). A Claude Code plugin cache directory has snuck into commits before via `-A`.
- More in `CLAUDE.md` → "Known gotchas".

## License

The source code is MIT (see `LICENSE`). The brand assets (logo, Makey mascot) and original photos are not — please don't reuse them without asking.

## Contact

Reach the board at <hello@piedmontmakers.org>.
