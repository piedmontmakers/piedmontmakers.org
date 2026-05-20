<wizard-report>
# PostHog post-wizard report

PostHog analytics has been integrated into piedmontmakers.org. The web snippet initializes on every page via a new `PostHog.astro` component imported into `BaseLayout.astro`. Eight custom events are captured across five pages using client-side `<script is:inline>` blocks. Environment variables are stored in `.env` (gitignored).

| Event | Description | File |
|---|---|---|
| `newsletter_signup_clicked` | User submits the Mailchimp newsletter signup form | `src/pages/index.astro` |
| `donate_clicked` | User clicks the Donate card linking to donate.piedmontmakers.org | `src/pages/index.astro` |
| `volunteer_clicked` | User clicks the Volunteer card | `src/pages/index.astro` |
| `buy_shirt_clicked` | User clicks the Buy a Shirt card linking to Bonfire | `src/pages/index.astro` |
| `robotics_register_clicked` | User clicks Register on TeamSnap; includes `level` property (fll-explore, fll-challenge, ftc, frc) | `src/pages/robotics.astro` |
| `program_card_clicked` | User clicks a program card on the events hub; includes `program_name` property | `src/pages/events.astro` |
| `donate_teacher_grants_clicked` | User clicks Donate to Teacher Grants | `src/pages/teacher-grants.astro` |
| `maker_faire_newsletter_clicked` | User clicks a newsletter subscribe link on the Maker Faire page | `src/pages/events/maker-faire.astro` |

## Next steps

We've built some insights and a dashboard to track user behavior based on the events above:

- [Analytics basics dashboard](/dashboard/1609398)
- [Key CTA clicks over time](/insights/FIz2MDvu) — line chart of newsletter, donate, volunteer, shirt clicks
- [Newsletter signups (total)](/insights/gd0D5KBd) — bold number, last 30 days
- [Donate clicks (total)](/insights/PvTIrjsK) — bold number, last 30 days
- [Robotics registrations by level](/insights/sHI4vdWM) — bar chart broken down by level
- [Program card clicks by program](/insights/Rrr5vmtd) — bar chart broken down by program name

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
