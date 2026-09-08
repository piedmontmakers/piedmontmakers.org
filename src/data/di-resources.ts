// External links listed in the "For team managers" section of /di. `kicker`
// is the small label above each title, so a parent knows what opens before
// they click (the hosting site, or a note like "Login required").
// `blurb` is a one- or two-sentence description of what they'll find there.
// The page layout itself is in src/pages/di.astro.

export interface DiResource {
  title: string;
  url: string;
  kicker: string;
  blurb: string;
}

export const teamManagerResources: DiResource[] = [
  {
    title: "Team Manager Training",
    url: "https://www.caldi.org/training/",
    kicker: "caldi.org · videos + Zoom",
    blurb:
      "Two recorded training modules you can watch on demand: starting a team, picking a challenge, and reading the materials in part one; conflict resolution, challenge strategy, storytelling, rules, and Instant Challenges in part two. The same page hosts live Challenge Orientation Webinars, where California's challenge masters walk through each challenge and take questions, plus the appraiser training every team must send one adult to.",
  },
  {
    title: "CalDI Team Resource Page",
    url: "https://sites.google.com/view/calditeamresourcepage/home",
    kicker: "caldi.org · guides",
    blurb:
      "Practical help for the work itself: materials and construction tips, a beginner's guide to writing a story and performing it, team-building activities, the Two-Minute Team Manager video series, and a program that pairs teams with experienced DI alumni for coaching and feedback.",
  },
  {
    title: "Season Challenge Materials",
    url: "https://resources.destinationimagination.org/resources.php/document/view",
    kicker: "DI Resource Area · login required",
    blurb:
      "The official documents for this season from Destination Imagination: the full text of each Team Challenge, Rules of the Road, and the Roadmap guide for team managers. Log in with the account you get once your team is registered.",
  },
];
