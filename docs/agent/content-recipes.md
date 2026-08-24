# Content Recipes for Coding Agents

Read this reference for routine content updates, blog posts, calendar events, or image preparation. Apply the voice, accessibility, verification, and git rules in `AGENTS.md`.

## Routine data edits

| Request | File | Edit |
|---|---|---|
| Registration opened or closed | `src/data/robotics-levels.ts` | Change `registerOpen`; adjust `registerClosedLabel` if needed |
| Coach-training or open-house deck | `src/data/robotics-levels.ts` | Update `coachTraining`, `openHousePresentation`, and matching `coachResources` title |
| Robotics FAQ | `src/data/robotics-faq.ts` | Edit the `faqItems` entry |
| Board roster | `src/data/board.ts` | Edit the matching group; count and page update automatically |
| New teacher-grant round | `src/data/teacher-grants.ts` | Add a year using the newest shape and add it to `allYears`; retire the previous year into a page `<details>` block |
| Headline impact stat | `src/data/stats.ts` | Edit the value; bands, hero copy, and `llms.txt` follow. **Not the teacher-grant figure** — that is hardcoded in `index.astro`, `support.astro`, and `about-us.astro` |
| Privacy policy wording | `src/copy/privacy-policy.md` | Edit the Markdown body; the page derives its title, meta description, and effective date from the frontmatter. Keep `501(&zwnj;c)(3)` written with a U+200C or CI fails |
| Support links or giving levels | `src/data/support.ts` | Edit constants or arrays |
| Program card | `src/data/programs.ts` | Edit the card |
| Community quote | `src/data/voices.ts` | Add a `Voice`; two or more voices switch to the grid layout |

## Add a blog post

Create `src/content/blog/YYYY-MM-DD-slug.md`:

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

Body in Markdown.
```

Inline images use HTML figures:

```html
<figure>
  <img src="/img/blog/your-post-slug/photo-a.jpg" alt="Description of the photo." />
  <figcaption>Caption text.</figcaption>
</figure>
```

Frontmatter image paths use `/img/...`; the resolver prepends the base. Inline images and links in body content must also be root-relative (`/img/...`, `/robotics`). The prose pipeline does not run the resolver, and production uses `base: '/'`. A hardcoded `/piedmontmakers.org/...` path fails on the live apex domain.

Root-relative body paths fail in local `npm run dev`, whose base is `/piedmontmakers.org/`. Verify them with `USE_CUSTOM_DOMAIN=true npm run build` served from `dist`.

## Add an event

Create `src/content/events/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Event title"
startDate: 2026-10-04
startTime: "11:00 AM"
endTime: "3:00 PM"
location: "Piedmont High School"
program: "maker-faire"
summary: "One-line summary."
actions:
  - type: tickets
    url: "https://eventbrite.com/..."
  - type: volunteer
    url: "https://signup-form-url"
---
```

Valid programs are `robotics`, `maker-faire`, `popup`, `build-like-a-girl`, `july-4`, and `other`. Valid actions are `tickets`, `register`, `volunteer`, `exhibit`, and `info`.

The calendar splits Upcoming and Past in the browser using each row's `data-event-date` and the visitor's local date. Past events become muted automatically.

`/calendar.ics` is generated at build time from the same event collection. Never hand-edit an `.ics` file. Google Calendar can use the direct `cid=webcal://...` shortcut. Do not use a bare `webcal://` link for Apple Calendar because Chrome on macOS may do nothing; show the HTTPS feed URL and tell users to paste it into Calendar > File > New Calendar Subscription.

Before correcting an event that may have moved or been cancelled, reconcile it with the public Google Calendar feed:

```text
https://calendar.google.com/calendar/ical/c_ca0d518d3a95ba84eebd97fe845dfd15778a4846de449f20f4e233f098b4dc51%40group.calendar.google.com/public/basic.ics
```

## Add a photo

Resize source photos to a maximum width of 1600 pixels:

```bash
sips --resampleWidth 1600 --setProperty formatOptions 82 \
  "/path/to/source.jpg" --out public/img/{section}/slug.jpg
```

Store photos under `public/img/programs/`, `public/img/robotics/`, `public/img/facilities/`, `public/img/qr/`, or `public/img/blog/{post-slug}/`. `PhotoCard` accepts paths such as `/img/programs/maker-faire.jpg` and prefixes the base automatically.

Favicons and app icons are Makey-based and generated at 16, 32, 180, 192, and 512 pixels with roughly 22 percent corner radius.
