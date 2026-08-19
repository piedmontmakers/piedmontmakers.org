# PostHog Conventions for Coding Agents

Read this reference before adding or changing analytics. The snippet is in `src/components/PostHog.astro` and is imported once by `BaseLayout.astro`. Local credentials use `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from the gitignored `.env` file.

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
