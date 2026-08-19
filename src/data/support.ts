// Content for /support, the QR-code landing page for donors + volunteers.
// Routine edits live here: the donate URL, volunteer email, suggested gift
// levels, and the "what support does" cards. The page layout is in
// src/pages/support.astro.

import { stats } from "./stats";

export const DONATE = "https://donate.piedmontmakers.org";
export const VOLUNTEER_EMAIL = "hello@piedmontmakers.org";
// Pre-filled subject so inbound volunteer mail is easy to triage.
export const VOLUNTEER_MAILTO = `mailto:${VOLUNTEER_EMAIL}?subject=${encodeURIComponent(
  "I'd like to volunteer with Piedmont Makers"
)}`;

// Reach and equity numbers. These matter most to the donor/volunteer read:
// they show the programs land beyond one zip code and beyond one demographic.
export const reach = [
  { number: stats.teams, label: "teams across all four FIRST levels" },
  { number: stats.outsidePiedmontShare, label: "of kids come from outside Piedmont" },
  { number: stats.titleOneShare, label: "of participants come from Title 1 schools" },
  { number: stats.volunteerHours, label: "volunteer hours logged in a year" },
];

// Suggested gift levels for the regional-infrastructure ask. Square doesn't
// take a prefilled amount from the URL, so these are anchors that set
// expectations before the donor lands on the form; each reports its own
// PostHog property so we learn which level people respond to.
export const givingLevels = ["$1,000", "$2,500", "$5,000", "$10,000"];

export const whatSupportDoes = [
  {
    title: "Puts a robotics kit in a kid's hands",
    body: "LEGO kits, competition parts, game tables, and uniforms, supplied to every team so families aren't buying their way in.",
  },
  {
    title: "Keeps cost from deciding who participates",
    body: "Financial aid is available at every level, quietly and on request. No kid gets turned away over the fee.",
  },
  {
    title: "Backs the adults who make it work",
    body: "Coach training, lesson plans, and a Slack community of 130+ coaches, so a parent with no engineering background can still run a strong team.",
  },
];
