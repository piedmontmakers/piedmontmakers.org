# CLAUDE.md — orientation for AI agents

You are working on **piedmontmakers.org**, the public website of Piedmont Makers, a 501(c)(3) nonprofit running FIRST Robotics teams, a community engineering lab, a School Maker Faire, popup maker spaces, and Build Like a Girl across the **East Bay**. The owner is Ben Stein, who serves as Co-President.

The site is being rebuilt off Wix. Stable enough that real photos and real content are wired in; iteration is ongoing.

## Live URLs

- Staging (current): https://piedmontmakers.github.io/piedmontmakers.org/
- Production (after DNS cutover): https://piedmontmakers.org/

`astro.config.mjs` flips `base` and `site` on the `USE_CUSTOM_DOMAIN=true` env var. The custom-domain switch is a one-line config change + DNS update; not done yet.

## Tech stack

| | |
|---|---|
| Static site generator | **Astro 5 (LTS)**. Do NOT upgrade to Astro 6 — it bundles rolldown and hits a `@rolldown/binding-darwin-arm64` native-binding bug under npm 11 that breaks the build. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. Theme tokens defined in `src/styles/global.css` under `@theme {}`. |
| Long-form prose | `@tailwindcss/typography` plugin, themed inline in `src/pages/blog/[...slug].astro`. |
| Content | Astro content collections (`src/content.config.ts`) for `blog/` and `events/`. Add a Markdown file = new content. |
| Forms | Mailchimp inline subscribe form on the home page, posting direct to the audience (no JS, no backend). |
| Hosting | GitHub Pages, deployed via `.github/workflows/deploy.yml` on push to `main`. |
| Repo | `piedmontmakers/piedmontmakers.org` (public). |

## File map

```
src/
├── pages/
│   ├── index.astro                  Home
│   ├── about.astro                  Mission, board, EIN, contact, impact
│   ├── robotics.astro               1 big page, 4 FIRST levels + FAQ
│   ├── programs.astro               Hub for non-robotics programs
│   ├── programs/{slug}.astro        Per-program detail (4 of them)
│   ├── facilities.astro             10th Street + Mary G. Ross Lab
│   ├── events.astro                 Calendar w/ client-side date split
│   ├── grants.astro                 Multi-year teacher-grants tables
│   ├── blog/index.astro             Blog list
│   ├── blog/[...slug].astro         Blog post template
│   └── styleguide.astro             Design-system reference
├── components/
│   ├── BaseLayout.astro             Shared <head>, fonts, meta, manifest
│   ├── Nav.astro / Footer.astro
│   ├── Ribbon.astro                 SIGNATURE ELEMENT — the banner from the logo
│   ├── PhotoCard.astro              Tilt + tape + caption photo treatment
│   ├── Scribble.astro               Hand-drawn SVG accents (underline, arrow, etc.)
│   ├── FAQ.astro                    <details>-based collapsible FAQ
│   ├── VoicesBand.astro             Dark-ink quote band — the bragging-stats replacement
│   └── StubPage.astro               "Coming soon" stub for unbuilt pages
├── content/
│   ├── blog/                        One Markdown file per post
│   └── events/                      One Markdown file per dated event
├── content.config.ts                Zod schemas for blog + events
├── layouts/BaseLayout.astro
└── styles/global.css                Tailwind imports + theme tokens + custom utilities
public/
├── img/{brand,programs,robotics,facilities,blog}/   Brand assets + page photos
├── favicon.ico + icon-*.png + apple-touch-icon.png  Generated from Makey
└── site.webmanifest
```

## Brand + design system

Colors (from `global.css`, sampled directly from the logo PNG):

| Token | Hex | Use |
|---|---|---|
| `pm-red` | `#E51926` | Primary brand. Hero ribbons, donate, sign-up CTAs. |
| `pm-cyan` | `#00AEEF` | Secondary brand. Volunteer/section accents. |
| `pm-purple` | `#92278F` | Mascot color. Makey, Build Like a Girl. |
| `pm-ink` | `#0F1B2D` | Body text + dark sections. |
| `pm-cream` / `pm-paper` | `#FFF6E8` / `#FFFCF6` | Default page backgrounds. Warmer than pure white. |

Typography:
- **Display + UI**: Bricolage Grotesque
- **Body**: Manrope
- **Hand-marker accent**: Caveat (used sparingly — *"since 2014!"*, *"tax-deductible!"*)

The **ribbon banner** (`Ribbon.astro`) is the signature element. Pulled directly from the logo's banner ribbons. Used for section eyebrows, badges, primary CTAs. Three sizes, four colors. Don't replace with a generic pill.

Page containers: every section uses `mx-auto max-w-7xl px-6` so the left edge aligns with the nav logo. Inner reading columns can be narrower (e.g. `max-w-3xl` on blog post prose) but always left-aligned within the wider shell — never centered into a narrower outer container.

## Voice — non-negotiable

**Audience: parents across the East Bay shopping for kid programs.** Not just Piedmont. Not corporate donors as the primary read.

**Make the community the hero, not the org.** Kids = innovators. Adults = volunteers. The org appears in passing.

- ✅ Stats *bands* are OK on `/about` (deliberate brag space) and `/grants` (honest accounting).
- ❌ Stats bands anywhere else lean structurally braggy. Use `VoicesBand.astro` (3 short quotes from kids / coaches / partner teachers) instead — same visual weight, community-centered content.

**Don't write LLM tells.** Ben will spot them. Specific things to avoid (in addition to the global rules in `~/.claude/CLAUDE.md`):
- `actually` / `actual` as emphasis — every instance got purged in May 2026, please don't bring them back
- "It's not X, it's Y" rhythm
- Tricolons / rule-of-three when the third item is just for cadence
- Day-of-week vignettes
- Em-dash spam

**"Piedmont" vs "East Bay" rule.** Keep "Piedmont" only in:
- The org name (Piedmont Makers)
- PUSD-specific content (Teacher Grants — that program *is* PUSD-only by design)
- Literal place names: Piedmont High School, Piedmont Middle School, Piedmont Veterans' Building, Highland Ave, the Piedmont 4th of July Parade
- The verbatim mission statement which already says "Piedmont, CA and beyond"

Anywhere else that describes the audience, rewrite to **"East Bay"** or **"Piedmont and beyond"**, or drop the geographic adjective entirely. Specifically: not "Piedmont kids", not "Piedmont parents", not "for kids and adults in Piedmont".

## Content editing patterns

### Add a blog post

Drop a Markdown file in `src/content/blog/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Title here"
pubDate: 2026-05-19
author: "Piedmont Makers"
excerpt: "One-sentence summary used on listings."
heroImage: "/img/blog/your-post-slug/hero.jpg"
heroImageAlt: "Alt text for the hero photo."
heroImageCaption: "Caption rendered under the hero."
---

Body in Markdown. Inline images use HTML <figure> tags:

<figure>
  <img src="/piedmontmakers.org/img/blog/your-post-slug/photo-a.jpg" alt="..." />
  <figcaption>Caption text.</figcaption>
</figure>
```

Image paths in Markdown frontmatter use `/img/...` (resolver prepends base). Inline `<img>` in body Markdown needs the full `/piedmontmakers.org/...` because the prose pipeline doesn't run the resolver.

### Add an event

Drop a Markdown file in `src/content/events/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Event title"
startDate: 2026-10-04
startTime: "11:00 AM"        # optional, free-form string
endTime: "3:00 PM"           # optional
location: "Piedmont High School"
program: "maker-faire"       # one of: robotics, maker-faire, popup, build-like-a-girl, july-4, other
summary: "One-line summary."
actions:
  - type: tickets            # tickets, register, volunteer, exhibit, info
    url: "https://eventbrite.com/..."
  - type: volunteer
    url: "https://signup-form-url"
---
```

The `/events` page splits Upcoming vs Past via a client-side script that reads each row's `data-event-date` attribute and compares to the visitor's local date. **Always-current without a rebuild.** Stays accurate after I'm long gone.

### Add a photo

```bash
sips --resampleWidth 1600 --setProperty formatOptions 82 \
  "/path/to/source.jpg" --out public/img/{section}/slug.jpg
```

Place under `public/img/programs/`, `public/img/robotics/`, `public/img/facilities/`, or `public/img/blog/{post-slug}/`. PhotoCard's `src` prop accepts relative paths like `/img/programs/maker-faire.jpg` and prefixes the base automatically.

For favicons / app icons (Makey-based): see the recipe in `public/`'s existing files. They're generated with ImageMagick at 16/32/180/192/512 with ~22% corner radius for the iOS squircle feel.

## Workflow

```bash
npm install
npm run dev        # leave this running — Ben previews changes via HMR
npm run build      # verify before commit
```

**Do not kill the dev server.** Ben watches changes live. The only exception is when Vite's asset graph wedges from a `public/` deletion (page returns 500 with `ENOENT`); the fix is `pkill -f "astro dev" && rm -rf .astro node_modules/.vite && npm run dev > /tmp/pm-dev.log 2>&1 &`. Tell Ben while you're doing it.

Commits push to `main` → GitHub Action deploys to GitHub Pages in ~30 seconds.

## Known gotchas

- **Astro 5, NOT 6.** Astro 6 + `@tailwindcss/vite` triggers the rolldown native-binding bug on macOS-arm64 under npm 11.
- **Tailwind arbitrary `grid-cols`** uses underscores between values, not commas: `grid-cols-[80px_1fr]` works; `grid-cols-[80px,1fr]` silently fails to a single column.
- **YAML dates parse as midnight UTC.** When formatting for display use `getUTCDate()` / `timeZone: "UTC"` so day numbers don't shift backward on the West Coast.
- **`base` path matters** for internal links. Use the `link()` / `asset()` helpers that strip the trailing slash and prepend `BASE_URL`. Internal hrefs in event/blog frontmatter should start with `/` and the template resolver prefixes the base.
- **Image paths in Markdown body** need the full `/piedmontmakers.org/...` path because the Markdown pipeline doesn't run the resolver.

## External services (out of scope to migrate)

| Service | URL | Notes |
|---|---|---|
| Donations | https://donate.piedmontmakers.org | Square, separate subdomain — do not touch |
| Newsletter | `piedmontmakers.us3.list-manage.com` audience `83b9d5d7df` user `edc89d8dd41a4ea6ee9352d9a` | Inline form already wired |
| T-shirts | https://www.bonfire.com/piedmont-makers-t-shirt/ | External link only |
| Robotics registration | TeamSnap forms (one per level) | Linked from `/robotics` |
| Maker Faire tickets | Eventbrite | Linked from event row + program page |
| Forms (exhibitor, volunteer, waiver, check-in) | Google Forms / Grasshopper / Google Script | Linked from relevant pages |

## Open TODOs flagged in pages

- Physical addresses for Engineering Lab + 10th Street (currently render as `italic "TODO — confirm public-facing address"`)
- Mailing address on `/about`
- Real photos for events that don't have them yet
- Email obfuscation for the 9 board emails on `/about` if spam becomes a problem
- DNS cutover to apex `piedmontmakers.org` + setting `USE_CUSTOM_DOMAIN=true` in the Action

## Helpful first moves on a fresh task

1. `git log --oneline -20` to see recent direction
2. `npm run dev` and open the relevant page in the browser
3. Edit. HMR shows it immediately.
4. `npm run build` before committing — catches schema/route errors
5. Commit messages: focused, descriptive, no Co-Authored-By line (per Ben's global preference)
