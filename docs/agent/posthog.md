# PostHog Conventions for Coding Agents

Read this reference before adding or changing analytics. The snippet is in `src/components/PostHog.astro` and is imported once by `BaseLayout.astro`.

**The project token and host are hardcoded in that file, on purpose. Do not move them to `.env`.** They were env vars until 2026-05-22, when analytics were found to have been silently dead in production: `.env` is gitignored, the Action had no PostHog variables set, so `apiKey` resolved to `undefined` and `posthog.init()` never ran. The live HTML literally read `const apiKey = undefined;`. A PostHog project token is public by design and ships in every page anyway, so there is nothing to protect. A stale `.env` with the old variable names may still be sitting in your repo root; nothing reads it.

The initialization uses `defaults: '2026-01-30'`, so autocapture covers pageviews and link clicks.

## Custom conversion events

| Event | Where | Properties |
|---|---|---|
| `newsletter_signup_clicked` | Home Mailchimp form submit | None |
| `donate_clicked` | Home help card; support hero and main cards | `source: 'home_how_to_help' \| 'support_page_hero' \| 'support_page_main'` |
| `donate_nav_clicked` | Nav donate ribbon | `source: 'desktop' \| 'mobile'` |
| `donate_teacher_grants_clicked` | Teacher Grants CTA | None |
| `volunteer_clicked` | Home help card; support hero and main cards | `source: 'home_how_to_help' \| 'support_page_hero' \| 'support_page_main'` |
| `buy_shirt_clicked` | Home Bonfire card | None |
| `robotics_register_clicked` | TeamSnap buttons on `/robotics` | `level: fll-explore \| fll-challenge \| ftc \| frc` |
| `di_register_clicked` | TeamSnap button on `/di` | `source: 'di_page'` |
| `di_watch_info_session_clicked` | Info-session video on `/di` | `source: 'di_page'` |
| `program_card_clicked` | Program cards on `/events` | `program_name` |
| `maker_faire_newsletter_clicked` | Newsletter links on Maker Faire page | None |
| `upcoming_event_clicked` | Home upcoming-event rows | `title` |

## Adding an event

Register a matching `posthog.capture()` call in a small inline `<script is:inline>` at the bottom of the page. Follow `/robotics` or `/teacher-grants` for the established pattern.

Target elements by a durable `id` or `data-` attribute. Do not target class chains. A selector based on `a.block.rounded-3xl.bg-pm-cyan` previously caused false attribution when styling changed.
