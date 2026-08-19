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
│   ├── 404.astro                    Branded 404 with dancing Makey
│   ├── support.astro                Unlinked donor and volunteer landing page
│   ├── styleguide.astro             Design-system reference
│   ├── rss.xml.ts                   Hand-rolled RSS 2.0 endpoint
│   ├── robots.txt.ts                Dynamic robots.txt
│   └── llms.txt.ts                  LLM-friendly site overview
├── components/
│   ├── BaseLayout.astro             Shared head, metadata, JSON-LD, skip link, fonts
│   ├── Nav.astro                    Desktop flyouts and mobile hamburger
│   ├── Footer.astro                 Footer, watermark, and social links
│   ├── PostHog.astro                Analytics initialization
│   ├── Ribbon.astro                 Signature logo-derived banner
│   ├── Banner.astro                 Announcement card
│   ├── PhotoCard.astro              Tilt, tape, and caption photo treatment
│   ├── Scribble.astro               Hand-drawn SVG accents
│   ├── FAQ.astro                    Details-based collapsible FAQ
│   └── VoicesBand.astro             One-quote or multi-quote band
├── content/
│   ├── blog/                        One Markdown file per post
│   └── events/                      One Markdown file per dated event
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
├── layouts/BaseLayout.astro
└── styles/global.css                Tailwind imports, theme tokens, utilities
public/
├── admin/                                           Sveltia CMS shell
├── img/{brand,programs,robotics,facilities,blog}/   Brand assets and photos
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

`BaseLayout.astro` emits canonical URLs, Open Graph and Twitter Card metadata, `NonprofitOrganization` JSON-LD, and RSS auto-discovery.

Endpoints:

- `/rss.xml`: hand-rolled RSS 2.0
- `/robots.txt`: dynamic and points to `/sitemap-index.xml`
- `/llms.txt`: dynamic Markdown overview
- `/sitemap-index.xml`: generated by `@astrojs/sitemap`

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

## Facility addresses

- 10th Street practice field: 3100 East 10th Street, Oakland, CA
- Mary G. Ross Engineering Lab: 800 Magnolia Ave, Piedmont, CA 94611, inside Piedmont High School

## Open page follow-ups

- Confirm and add a mailing address on `/about-us`.
- Replace the Maker Faire 2026 recap placeholder when final stats and photos are available.
- Replace the logo-based Open Graph image with a proper 1200x630 image.
- Add verified student or coach quotes when available.
- After-school enrichment is paused for Fall 2026. When it returns, uncomment the nav link and the card block in `src/data/programs.ts`; the detail page remains at `/events/after-school`.
