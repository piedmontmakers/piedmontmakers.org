# Site Reference for Coding Agents

Read this reference for page structure, brand implementation, shared components, SEO, CMS architecture, external services, or known page follow-ups. The safety, voice, accessibility, and git rules in `AGENTS.md` still apply.

## Tech stack

| | |
|---|---|
| Static site generator | **Astro 5 (LTS)**. Do not upgrade to Astro 6. It bundles rolldown and hits a `@rolldown/binding-darwin-arm64` native-binding bug under npm 11 that breaks the build. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. Theme tokens are in `src/styles/global.css` under `@theme {}`. |
| Long-form prose | `@tailwindcss/typography`, themed inline in `src/pages/blog/[...slug].astro`. |
| Content | Astro content collections (`src/content.config.ts`) for `blog/` and `events/`. |
| Analytics | PostHog. See `docs/agent/posthog.md`. |
| Forms | Mailchimp inline subscribe form on the home page, posting directly to the audience. |
| Hosting | GitHub Pages, deployed by `.github/workflows/deploy.yml` on pushes to `main`. |
| Repo | `piedmontmakers/piedmontmakers.org` (public). |

## File map

Page slugs went through a large rename (Events to Calendar, Programs to Events, Grants to Teacher Grants, About to About Us). Redirects in `astro.config.mjs` cover the old slugs.

```text
src/
├── pages/
│   ├── index.astro                  Home
│   ├── about-us.astro               Mission, board, EIN, contact, impact
│   ├── robotics.astro               Four FIRST levels and FAQ
│   ├── events.astro                 Hub for non-robotics programs
│   ├── events/{slug}.astro          Per-program detail
│   ├── events/maker-faire/          Maker Faire sub-pages
│   ├── facilities.astro             10th Street and Mary G. Ross Engineering Lab
│   ├── calendar.astro               Dated event calendar
│   ├── teacher-grants.astro         Multi-year teacher-grants tables
│   ├── blog/index.astro             Blog list
│   ├── blog/[...slug].astro         Blog post template
│   ├── di.astro                     Destination Imagination pilot
│   ├── 10th-street-check-in.astro   Visitor check-in for the FRC field
│   ├── privacy.astro                Privacy policy; body imported from src/copy/
│   ├── 404.astro                    Branded 404 with dancing Makey; noindex + agent-recovery block
│   ├── support.astro                Unlinked donor and volunteer landing page
│   ├── styleguide.astro             Design-system reference; noindex, excluded from the sitemap
│   ├── rss.xml.ts                   Hand-rolled RSS 2.0 endpoint
│   ├── calendar.ics.ts              Subscribable iCalendar feed
│   ├── robots.txt.ts                Dynamic robots.txt
│   └── llms.txt.ts                  LLM-friendly site overview
├── components/
│   ├── Nav.astro                    Desktop flyouts and mobile hamburger
│   ├── Footer.astro                 Footer, watermark, and social links
│   ├── PostHog.astro                Analytics initialization
│   ├── Ribbon.astro                 Signature logo-derived banner
│   ├── Banner.astro                 Announcement card
│   ├── PhotoCard.astro              Tilt, tape, and caption photo treatment
│   ├── Scribble.astro               Hand-drawn SVG accents
│   ├── FAQ.astro                    Details-based collapsible FAQ
│   ├── StatsBand.astro              Dark band of four headline numbers
│   └── VoicesBand.astro             One-quote or multi-quote band
├── content/
│   ├── blog/                        One Markdown file per post
│   └── events/                      One Markdown file per dated event
├── copy/                            Long-form page prose, imported as Markdown
│   └── privacy-policy.md            Privacy policy body; frontmatter drives the page
├── lib/
│   └── event-time.ts                Event time parsing and formatting helpers
├── data/                            Routine content changes
│   ├── stats.ts                     Headline impact numbers and formatters
│   ├── robotics-levels.ts           Registration toggles and resource URLs
│   ├── robotics-faq.ts              Robotics FAQ entries
│   ├── board.ts                     Board roster
│   ├── teacher-grants.ts            Award tables
│   ├── support.ts                   Support links and giving levels
│   ├── programs.ts                  Events hub program cards
│   └── voices.ts                    Home-page community quotes
├── content.config.ts                Content schemas
├── layouts/BaseLayout.astro         Shared head, metadata, JSON-LD, skip link, fonts
└── styles/global.css                Tailwind imports, theme tokens, utilities
public/
├── admin/                                           Sveltia CMS shell
├── img/{brand,programs,robotics,facilities,blog,qr}/  Brand assets, photos, QR codes
├── favicon.ico + icon-*.png + apple-touch-icon.png  Makey-based icons
└── site.webmanifest
```

## Brand implementation

Colors sampled from the logo:

| Token | Hex | Use |
|---|---|---|
| `pm-red` | `#E51926` | Primary brand, hero ribbons, donate and sign-up calls to action |
| `pm-cyan` | `#00AEEF` | Secondary brand, volunteer and section accents, focus ring |
| `pm-purple` | `#92278F` | Mascot, Build Like a Girl |
| `pm-ink` | `#0F1B2D` | Body text and dark sections |
| `pm-cream` / `pm-paper` | `#FFF6E8` / `#FFFCF6` | Page backgrounds |

Typography:

- Display and UI: Bricolage Grotesque
- Body: Manrope
- Hand-marker accent: Caveat, used sparingly

Manrope uses `font-feature-settings: "ss02"` in `body`. Keep `ss01` off because it converts `(c)` to © and breaks `501(c)(3)`.

`Ribbon.astro` is the signature design element, derived from the logo's banner ribbons. It is used for section eyebrows, badges, and primary calls to action. Do not replace it with a generic pill.

Every page section uses `mx-auto max-w-7xl px-6` so its left edge aligns with the nav logo. Inner reading columns can be narrower but remain left-aligned within the wider shell.

## SEO and discovery

`BaseLayout.astro` emits canonical URLs, Open Graph and Twitter Card metadata, organization JSON-LD, and RSS auto-discovery. It takes an optional `noindex` prop that emits `robots: noindex` and suppresses the canonical link; `404.astro` and `styleguide.astro` use it.

The org schema is multi-typed as `["Organization", "NonprofitOrganization"]` and carries `@id`, `legalName`, `nonprofitStatus`, a city-level `PostalAddress` (no street, by decision: the org is volunteer-run and has no office), and two `ContactPoint`s (general and privacy). `scripts/check-structured-data.mjs` enforces the type, the address, and the contact points, so simplifying `@type` back to a string fails the build. See the SEO section of AGENTS.md for why.

Endpoints:

- `/rss.xml`: hand-rolled RSS 2.0, blog posts only
- `/calendar.ics`: subscribable iCalendar feed, one VEVENT per file in `src/content/events/`; contract-tested by `scripts/check-calendar-feed.mjs`
- `/robots.txt`: dynamic. Allows everything, disallows the `/admin/` CMS shell (base-aware), and points to `/sitemap-index.xml`
- `/llms.txt`: dynamic Markdown overview. Carries a `## When to use this site` section whose heading and feed links are required by `scripts/check-agent-readiness.mjs`
- `/sitemap-index.xml`: generated by `@astrojs/sitemap`. Every page is included automatically **except** `/styleguide`, filtered out in `astro.config.mjs`

## Shared component patterns

### VoicesBand

`src/components/VoicesBand.astro` branches on `voices.length`:

- One voice produces a centered pull quote with `max-w-3xl`.
- Two or more voices produce a three-column grid with divider rules.

Home uses Roy's single verified quote. The robotics quote band was removed with its placeholder content.

### Banner announcements

`src/components/Banner.astro` is a brand-colored card for time-bound announcements. Props are `eyebrow`, `headline`, optional `body`, optional `ctaLabel` plus `ctaHref`, and `color` (`red`, `cyan`, or `purple`; default `cyan`).

Import it from the page frontmatter, adjusting the relative path for nested pages:

```astro
import Banner from "../components/Banner.astro";
```

Place it in the standard page shell:

```astro
<!-- Time-bound announcement: remove or update after DATE. -->
<section class="mx-auto max-w-7xl px-6 pt-10 md:pt-12">
  <Banner
    color="cyan"
    eyebrow="Now open"
    headline="Registration is open"
    body="Short context line."
    ctaLabel="Register"
    ctaHref="/robotics"
  />
</section>
```

Use red for urgent registration or donate asks, cyan for general announcements, and purple for Build Like a Girl or mascot-forward moments. Date-bound callouts need a nearby removal comment. When one expires, remove the page-level section and unused import, not `Banner.astro`.

### Teacher Grants past years

The current year is expanded with its full table and supporting content. Retired years use `<details>` under “Past years.” Each summary shows the year ribbon, total, project count, and a rotating disclosure indicator.

## Blog CMS

`/admin/` runs Sveltia CMS. `public/admin/index.html` and `public/admin/config.yml` load a pinned bundle from unpkg. GitHub OAuth is proxied through the configured Cloudflare Worker. Anyone with Write access to the repo can save posts, and saves become commits authored by that editor's GitHub user.

Setup and editor access instructions live in `docs/admin-setup.md`.

## External services

| Service | URL | Notes |
|---|---|---|
| Donations | https://donate.piedmontmakers.org | Square, separate subdomain; do not migrate |
| Newsletter | `piedmontmakers.us3.list-manage.com` audience `83b9d5d7df`, user `edc89d8dd41a4ea6ee9352d9a` | Inline form is wired |
| T-shirts | https://www.bonfire.com/piedmont-makers-t-shirt/ | External link only |
| Robotics registration | TeamSnap forms | One per level |
| Maker Faire tickets | Eventbrite | Linked from event row and program page |
| Forms | Google Forms, Grasshopper, Google Script | Linked from relevant pages |
| Instagram | https://www.instagram.com/piedmontmakers/ | Footer social |
| LinkedIn | https://www.linkedin.com/company/piedmont-makers | Footer social |
| YouTube | https://www.youtube.com/channel/UCwhVj67myzJX6X7ZxCxai6g | Footer social |
| X | https://x.com/piedmontmakers | Footer social |
| Facebook | https://www.facebook.com/groups/piedmontmakers | Footer links to the group |
| Calendar | See `docs/agent/content-recipes.md` | Google Calendar is the reconciliation source |

## Stats provenance and facts.json

Headline numbers live in `src/data/stats.ts`, not in page markup — edit them there and every band, hero line, `llms.txt`, and `/facts.json` follows. Provenance and gotchas:

- The 2026-27 figures (1,000+ kids, 150+ teams) come from the FLL Challenge coach training deck; other stats trace to Airtable. Refresh is manual, on demand — the values are marketing-rounded display strings, and `/facts.json` labels them `"precision": "display"`.
- `stats.ts` carries an unresolved note: an older canonical-stats list said 20 East Bay cities; the site standardized on 25+. Reconcile against the real roster count when confirmed.
- **The teacher-grant figure is the exception, and it bites**: it is not in `stats.ts`. `"$25K+"` is hardcoded in `src/pages/index.astro` and `src/pages/support.astro`, and `"$25,694"` in `src/pages/about-us.astro`, while the authoritative total lives in `src/data/teacher-grants.ts` (which computes it, so it can't drift). Updating the grant total means editing those three pages by hand until someone wires them to `teacher-grants.ts` (see Open page follow-ups).
- `"130+ coaches"` is hardcoded in prose in `src/data/support.ts` and `src/data/robotics-levels.ts` — not in `stats.ts` at all.
- `src/pages/facts.json.ts` is the machine-readable contract over `src/data/` for the org's agents (the `piedmontmakers/agents` hub fetches it instead of copying numbers). Its shape is enforced by `scripts/check-agent-readiness.mjs` (deploy gate 7), including a check that `llms.txt` and `facts.json` agree on the headline stats. Renaming or dropping `src/data/` fields that feed it will fail the deploy — that's the contract working; update `facts.json.ts` and the check together, and bump `schemaVersion` on breaking shape changes.

## Facility addresses

- 10th Street practice field: 3100 East 10th Street, Oakland, CA
- Mary G. Ross Engineering Lab: 800 Magnolia Ave, Piedmont, CA 94611, inside Piedmont High School

## Open page follow-ups

Last reviewed 2026-08-24.

- Replace the logo-based Open Graph image with a proper 1200x630 image. Still open: `public/img/brand/` holds only `logo.png` and `makey.png`, and `BaseLayout.astro` falls back to the logo for both `og:image` and `twitter:image` while declaring `summary_large_image`. 56 of 61 built pages share it; only blog posts set their own.
- Add verified student or coach quotes when available. Still open: `src/data/voices.ts` has exactly one entry, so the multi-quote three-column branch of `VoicesBand` has never rendered.
- After-school enrichment is paused for the 2026-27 school year. When it returns, uncomment the card block in `src/data/programs.ts`, uncomment the nav entry in `src/components/Nav.astro` (a **red-zone** file, so this needs explicit confirmation), and remove the "On pause" banner from `src/pages/events/after-school.astro`. The detail page remains at `/events/after-school`.
- Wire the teacher-grant figure to `src/data/teacher-grants.ts`. It is hardcoded in `index.astro`, `support.astro`, and `about-us.astro`, so updating the awarded total means editing three pages by hand.
- Decide whether `/about-us` should carry a postal address. The original follow-up said to add one; since then `BaseLayout.astro` deliberately publishes a city-level `PostalAddress` only, on the grounds that the org is volunteer-run and a street address would be a board member's house. Close this or restate it.
- Replace the Destination Imagination photo on `/di`. The current one is sourced from caldi.org and marked "pending permission" in a `TODO` comment.

Closed since the last review: the Maker Faire 2026 recap (final stats, named quote, and four real photos shipped in `src/content/blog/2026-05-18-maker-faire-2026-recap.md`), and the missing `/privacy` page (now live, linked from the footer, CI-enforced).
