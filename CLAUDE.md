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
| Analytics | PostHog. See PostHog section below. |
| Forms | Mailchimp inline subscribe form on the home page, posting direct to the audience (no JS, no backend). |
| Hosting | GitHub Pages, deployed via `.github/workflows/deploy.yml` on push to `main`. |
| Repo | `piedmontmakers/piedmontmakers.org` (public). |

## File map

Page slugs went through a big rename (Events→Calendar, Programs→Events, Grants→Teacher Grants, About→About Us). Redirects in `astro.config.mjs` cover the old slugs.

```
src/
├── pages/
│   ├── index.astro                  Home
│   ├── about-us.astro               Mission, board, EIN, contact, impact
│   ├── robotics.astro               1 big page, 4 FIRST levels + FAQ
│   ├── events.astro                 Hub for non-robotics programs (was /programs)
│   ├── events/{slug}.astro          Per-program detail (5 of them)
│   ├── events/maker-faire/          Maker Faire sub-pages (meet-the-makers, project-ideas)
│   ├── facilities.astro             10th Street + Mary G. Ross Engineering Lab
│   ├── calendar.astro               Dated event calendar (was /events)
│   ├── teacher-grants.astro         Multi-year teacher-grants tables (was /grants)
│   ├── blog/index.astro             Blog list
│   ├── blog/[...slug].astro         Blog post template
│   ├── 404.astro                    Branded 404 with dancing Makey
│   ├── styleguide.astro             Design-system reference
│   ├── rss.xml.ts                   Hand-rolled RSS 2.0 endpoint
│   ├── robots.txt.ts                Dynamic robots.txt (points at sitemap)
│   └── llms.txt.ts                  Dynamic llms.txt (LLM-friendly site overview)
├── components/
│   ├── BaseLayout.astro             Shared <head>, OG/Twitter, JSON-LD, skip-link, fonts
│   ├── Nav.astro                    Desktop flyouts + mobile hamburger
│   ├── Footer.astro                 3-col footer + watermark + SVG socials
│   ├── PostHog.astro                Inline analytics snippet, imported by BaseLayout
│   ├── Ribbon.astro                 SIGNATURE ELEMENT — the banner from the logo
│   ├── PhotoCard.astro              Tilt + tape + caption photo treatment
│   ├── Scribble.astro               Hand-drawn SVG accents (underline, arrow, etc.)
│   ├── FAQ.astro                    <details>-based collapsible FAQ
│   └── VoicesBand.astro             Dark-ink quote band; auto-branches 1-quote vs 3-grid
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
| `pm-cyan` | `#00AEEF` | Secondary brand. Volunteer/section accents. Focus-visible ring. |
| `pm-purple` | `#92278F` | Mascot color. Makey, Build Like a Girl. |
| `pm-ink` | `#0F1B2D` | Body text + dark sections. |
| `pm-cream` / `pm-paper` | `#FFF6E8` / `#FFFCF6` | Default page backgrounds. Warmer than pure white. |

Typography:
- **Display + UI**: Bricolage Grotesque
- **Body**: Manrope
- **Hand-marker accent**: Caveat (used sparingly — *"since 2014!"*, *"tax-deductible!"*)

Manrope font features: `font-feature-settings: "ss02"` in `body` (open digits). **ss01 stays off** — it converts `(c)` → © and breaks every `501(c)(3)` on the site.

The **ribbon banner** (`Ribbon.astro`) is the signature element. Pulled directly from the logo's banner ribbons. Used for section eyebrows, badges, primary CTAs. Three sizes, four colors. Don't replace with a generic pill.

Page containers: every section uses `mx-auto max-w-7xl px-6` so the left edge aligns with the nav logo. Inner reading columns can be narrower (e.g. `max-w-3xl` on blog post prose) but always left-aligned within the wider shell — never centered into a narrower outer container.

## Voice — non-negotiable

**Audience: parents across the East Bay shopping for kid programs.** Not just Piedmont. Not corporate donors as the primary read.

**Make the community the hero AND show that we're a great org worth supporting.** Kids = innovators. Adults = volunteers. AND we're confidently the org doing this work — confident impact statements ("the largest community-based youth robotics league in the United States," "~1,000 kids on 125+ teams") instill trust in parents and donors, they aren't bragging.

- ✅ **Stats bands** are welcome on home, about, and grants. Frame as community-in-numbers ("~1,000 kids across 90+ schools") rather than org-look-at-us ("we run the largest league"). The "largest community-based youth robotics league in America" claim is a credibility signal, not a brag — use it.
- ✅ **VoicesBand** stays — community quote band. Currently one real quote from Roy on home; band removed from /robotics. Placeholder quotes were purged.

**Headlines lead with value to families, not org-internal facts.** Two patterns that got fixed this session:
- ❌ "Two new programs. Both sold out in minutes." (org FOMO) → ✅ "Hands-on STEAM, after the school day."
- ❌ "Built in partnership with PUSD through a $245,000 capital campaign and dedicated April 29, 2023" leading a section → ✅ "The community engineering classroom at Piedmont High School. Home base for FTC robotics teams, after-school engineering programs, and the annual K-8 robotics open houses." Move fundraising history to the meta-grid / donor list.

The "sold out in minutes" line is fine as **FOMO copy in body** (e.g. newsletter CTA), just not as a headline.

Avoid **time-locked framing** that goes stale fast. "New in Fall 2025" reads as old in the 2026-27 school year. Prefer evergreen phrasing or the actual current year.

**Don't write LLM tells.** Ben will spot them. Specific things to avoid (in addition to the global rules in `~/.claude/CLAUDE.md`):
- `actually` / `actual` as emphasis — every instance got purged in May 2026, please don't bring them back
- `real` as emphasis filler ("real engineering," "real tools," "real impact"). Replaced with `serious`, `working`, `full`, or just dropped — purged site-wide in May 2026
- "It's not X, it's Y" rhythm
- Tricolons / rule-of-three when the third item is just for cadence
- Day-of-week vignettes
- **Em-dash spam** — site-wide purge done in May 2026; only intentional uses remain (level names like "FTC — FIRST Tech Challenge", marker accents like "psst —", bylines like "— Co-Presidents", the verbatim mission statement, and one dramatic headline "AP Physics C — approved."). When new prose calls for separation, prefer commas, colons, or periods.

**STEM → STEAM.** Always STEAM (Science, Technology, Engineering, Arts, Math) site-wide. Including derived phrasing like "non-STEM coaches" → "non-STEAM coaches." Exception: the verbatim mission statement uses "S.T.E.A.M." with periods — leave that alone.

**Minimize "FLL" jargon in prose.** Prefer "LEGO League" (colloquial) or "FIRST LEGO League" (formal) when writing for parents. FLL is acceptable in space-constrained UI: buttons, photoCaption labels, nav sublinks, coach-training titles, alt text, code variable names. Visible body prose should spell it out. FTC and FRC abbreviations are fine — Ben hasn't flagged those as jargon, and parents shopping for high-school robotics encounter them often enough.

**Don't bold names of honored individuals.** Mary G. Ross, Annie Easley Cannon, Mary Wynne Montague, etc. get plain text, no `<strong>`. Bold reads as emphasis-for-the-reader-to-act-on; honoree names are just listed.

**"Piedmont" vs "East Bay" rule.** Keep "Piedmont" only in:
- The org name (Piedmont Makers)
- PUSD-specific content (Teacher Grants — that program *is* PUSD-only by design)
- Literal place names: Piedmont High School, Piedmont Middle School, Piedmont Veterans' Building, Highland Ave, the Piedmont 4th of July Parade
- The verbatim mission statement which already says "Piedmont, CA and beyond"

Anywhere else that describes the audience, rewrite to **"East Bay"** or **"Piedmont and beyond"**, or drop the geographic adjective entirely. Specifically: not "Piedmont kids", not "Piedmont parents", not "for kids and adults in Piedmont".

## Donor-amount policy

**Don't publish the specific dollar amount any named third-party donor gave to us.** List the donor names and the nature of their contribution if useful (`"Grant"`, `"CNC Router · in-kind"`), but no per-donor dollar amounts.

**Do publish dollar amounts the org GAVE OUT.** Teacher grant totals, per-school breakdowns, individual grant amounts to named teachers — all fair game on `/teacher-grants`. That's accountability.

**Aggregate campaign totals** are OK *only when* they sum across enough donors that the total reveals no individual's amount. The Engineering Lab capital campaign ($245K across 60+ donors) qualifies. The 10th Street facility campaign had only 2-3 named donors — the aggregate would reveal individual amounts by subtraction, so we don't publish it either.

## Mobile patterns

Audit at 390×844 (iPhone 14) in Chrome DevTools after structural changes.

- **Hero collage on home**: the 3-photo overlapping collage doesn't compose well below ~640px. Use `md:hidden` for a single hero photo on mobile and `hidden md:block` for the desktop collage. See the home hero for the pattern.
- **Card identifier order**: on cards that pair a photo with a label (home robotics levels, home + /events program cards), put the Ribbon (level/program name) + ages BEFORE the PhotoCard so mobile users see what they're scrolling through. On desktop the photo-then-text source order rarely matters because grids redistribute.
- **Robotics deep page (`/robotics`)**: the per-level cards use `order-last md:order-none` on the photo div so mobile readers get text-first while desktop's alternating left/right layout is preserved.

## Accessibility patterns

- **Skip-to-main-content link** lives at the top of `<body>` in `BaseLayout`. Hidden until focused (via `.sr-only` + `focus:not-sr-only`), then jumps to `#main-content` on `<main>`.
- **`:focus-visible`** is styled globally in `global.css` — brand cyan 2px outline, 3px offset. Keyboard-only; mouse clicks don't trigger it.
- **`prefers-reduced-motion: reduce`** is honored: animations, transitions, scroll-behavior, and photo-card tilts all flatten. Defined globally in `global.css`. The 404 page's dancing Makey also has a local override.
- **Alt tags** required on every `<img>`. Audit: `grep -rEn '<img\s[^>]*>' src/ --include="*.astro" | grep -v 'alt='` should return empty.
- **Aria-labels** on icon-only links (footer socials, nav hamburger). SVGs marked `aria-hidden="true"`.

## SEO / discovery

`BaseLayout.astro` emits:
- Canonical URL per page (`<link rel="canonical">`)
- Open Graph + Twitter Card meta (page-level `ogImage` + `ogType` props; blog posts pass `ogType="article"` and `ogImage={post.data.heroImage}`)
- JSON-LD `NonprofitOrganization` schema
- RSS auto-discovery `<link rel="alternate">`

Endpoints:
- `/rss.xml` — hand-rolled RSS 2.0 (see "Known gotchas" for why not `@astrojs/rss`)
- `/robots.txt` — dynamic; points at `/sitemap-index.xml`
- `/llms.txt` — dynamic markdown overview for LLM crawlers
- `/sitemap-index.xml` — `@astrojs/sitemap` generated

## PostHog analytics

Snippet in `src/components/PostHog.astro`, imported once from `BaseLayout`. Env vars `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env` (already gitignored). Defaults config to `defaults: '2026-01-30'` so autocapture covers pageviews + link clicks.

Custom conversion events (in addition to autocapture):

| Event | Where | Properties |
|---|---|---|
| `newsletter_signup_clicked` | home Mailchimp form submit | — |
| `donate_clicked` | home "How to help" card | `source: 'home_how_to_help'` |
| `donate_nav_clicked` | nav donate ribbon (every page) | `source: 'desktop' \| 'mobile'` |
| `donate_teacher_grants_clicked` | /teacher-grants CTA | — |
| `volunteer_clicked` | home "How to help" card | `source: 'home_how_to_help'` |
| `buy_shirt_clicked` | home Bonfire card | — |
| `robotics_register_clicked` | each TeamSnap button on /robotics | `level: fll-explore \| fll-challenge \| ftc \| frc` |
| `program_card_clicked` | /events program cards | `program_name` |
| `maker_faire_newsletter_clicked` | newsletter links on /events/maker-faire | — |

When adding new CTAs, register a matching `posthog.capture()` call in a small inline `<script is:inline>` at the bottom of the page (see /robotics or /teacher-grants for the pattern). **Target by `id` or `data-` attribute, not class chains** — a fragile `a.block.rounded-3xl.bg-pm-cyan` selector caused a false-attribution bug; IDs are durable to styling changes.

## VoicesBand: 1-quote vs grid

`src/components/VoicesBand.astro` branches on `voices.length`:
- 1 voice → centered pull-quote (text-2xl md:text-3xl, oversized opening glyph, `max-w-3xl`)
- 2+ voices → 3-col grid with vertical divider rules

Home uses 1 voice (Roy's quote). /robotics' band was removed (was placeholder content). If you collect real quotes later, drop them into either pattern.

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

The `/calendar` page splits Upcoming vs Past via a client-side script that reads each row's `data-event-date` attribute and compares to the visitor's local date. **Always-current without a rebuild.** Past events get `filter: grayscale(70%) opacity-60`, restored on hover.

When events you authored go stale (predictions about future events that didn't happen, dates that shifted), reconcile against the real Google Calendar before assuming. The iCal feed is:
```
https://calendar.google.com/calendar/ical/c_ca0d518d3a95ba84eebd97fe845dfd15778a4846de449f20f4e233f098b4dc51%40group.calendar.google.com/public/basic.ics
```

### Add a photo

```bash
sips --resampleWidth 1600 --setProperty formatOptions 82 \
  "/path/to/source.jpg" --out public/img/{section}/slug.jpg
```

Place under `public/img/programs/`, `public/img/robotics/`, `public/img/facilities/`, or `public/img/blog/{post-slug}/`. PhotoCard's `src` prop accepts relative paths like `/img/programs/maker-faire.jpg` and prefixes the base automatically.

For favicons / app icons (Makey-based): see the recipe in `public/`'s existing files. They're generated with ImageMagick at 16/32/180/192/512 with ~22% corner radius for the iOS squircle feel.

## Workflow

```bash
npm install          # see warning in Known gotchas
npm run dev          # leave this running — Ben previews changes via HMR
npm run build        # verify before commit
```

**Do not kill the dev server.** Ben watches changes live. The only exception is when Vite's asset graph wedges from a `public/` deletion (page returns 500 with `ENOENT`); the fix is `pkill -f "astro dev" && rm -rf .astro node_modules/.vite && npm run dev > /tmp/pm-dev.log 2>&1 &`. Tell Ben while you're doing it.

**Stage specific files when committing**, not `git add -A`. The Claude Code plugin cache (`.claude/skills/`) sat next to the working tree and snuck into one commit via `-A`. `.claude/` is now in `.gitignore`, but staging explicit paths is still safer.

Commits push to `main` → GitHub Action deploys to GitHub Pages in ~30 seconds.

## Known gotchas

- **Astro 5, NOT 6.** Astro 6 + `@tailwindcss/vite` triggers the rolldown native-binding bug on macOS-arm64 under npm 11.
- **`npm install` can drop `@rolldown/binding-*` optional deps.** Symptom: build fails with `Cannot find module '@rolldown/binding-darwin-arm64'` after an otherwise-innocent `npm install <something>`. Recovery: `git checkout package-lock.json && rm -rf node_modules && npm ci`. For adding new deps, prefer `npm ci` first (to lock the optional deps from the lockfile) then `npm install <pkg> --include=optional`.
- **`501(c)(3)` renders as `501©(3)`.** Manrope substitutes the `(c)` glyph sequence to © via an OpenType feature that `font-feature-settings: "ss02"` (dropping ss01) doesn't reach. The bulletproof fix: zero-width non-joiner between `(` and `c`. Use `&zwnj;` in template text, U+200C literal `‌` in TS strings. All existing `501(c)(3)` on the site already uses this — follow the pattern when adding new ones.
- **`@astrojs/rss` is not installed.** Its install path drops the `@rolldown` optional bindings (see above). RSS is hand-rolled in `src/pages/rss.xml.ts`. If you change the feed, edit that file; don't reach for the package.
- **Tailwind arbitrary `grid-cols`** uses underscores between values, not commas: `grid-cols-[80px_1fr]` works; `grid-cols-[80px,1fr]` silently fails to a single column.
- **YAML dates parse as midnight UTC.** When formatting for display use `getUTCDate()` / `timeZone: "UTC"` so day numbers don't shift backward on the West Coast.
- **`base` path matters** for internal links. Use the `link()` / `asset()` helpers that strip the trailing slash and prepend `BASE_URL`. Internal hrefs in event/blog frontmatter should start with `/` and the template resolver prefixes the base. Dynamic endpoints (`rss.xml.ts`, `robots.txt.ts`, `llms.txt.ts`) compose URLs by concatenating `context.site` + `import.meta.env.BASE_URL` to handle the staging vs apex domain switch.
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
| Instagram | https://www.instagram.com/piedmontmakers/ | Footer social |
| LinkedIn | https://www.linkedin.com/company/piedmont-makers | Footer social |
| YouTube | https://www.youtube.com/channel/UCwhVj67myzJX6X7ZxCxai6g | Footer social |
| X | https://x.com/piedmontmakers | Footer social |
| Facebook group | https://www.facebook.com/groups/piedmontmakers | Footer social (the group, not a page) |
| Calendar (iCal feed) | See "Add an event" above | Source of truth for past + future events |

## Known facility addresses

- **10th Street practice field**: 3100 East 10th Street, Oakland, CA
- **Mary G. Ross Engineering Lab**: 800 Magnolia Ave, Piedmont, CA 94611 (inside Piedmont High School; dedicated April 29, 2023)

## Open TODOs flagged in pages

- Mailing address on `/about-us` (currently nothing rendered — `dt`/`dd` removed)
- Real photos for events that don't have them yet (most past events have no actions/landing pages — that's OK)
- Email obfuscation for the board emails on `/about-us` if spam becomes a problem
- DNS cutover to apex `piedmontmakers.org` + setting `USE_CUSTOM_DOMAIN=true` in the Action
- 12th Annual Maker Faire 2026 recap stats (the recap card still says "Recap details and 2026 photos are coming soon")
- Real OG image (currently uses the brand logo PNG, not the ideal 1200×630 ratio)
- Real student / coach quotes for the VoicesBand pattern (home currently uses one real quote from Roy)

## Helpful first moves on a fresh task

1. `git log --oneline -20` to see recent direction
2. `npm run dev` and open the relevant page in the browser
3. Edit. HMR shows it immediately.
4. `npm run build` before committing — catches schema/route errors
5. Commit messages: focused, descriptive, no Co-Authored-By line (per Ben's global preference)
6. Stage explicit paths (`git add src/...`), not `git add -A`
