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
      "Two recorded modules: starting a team and picking a challenge, then strategy, storytelling, rules, and Instant Challenges. Also hosts the live challenge orientation webinars and the appraiser training every team must send one adult to.",
  },
  {
    title: "CalDI Team Resource Page",
    url: "https://sites.google.com/view/calditeamresourcepage/home",
    kicker: "caldi.org · guides",
    blurb:
      "Building and materials tips, a beginner's guide to story and performance, team-building activities, the Two-Minute Team Manager videos, and mentor matching with DI alumni.",
  },
  {
    title: "Season Challenge Materials",
    url: "https://resources.destinationimagination.org/resources.php/document/view",
    kicker: "DI Resource Area · login required",
    blurb:
      "The official documents for this season: each Team Challenge, Rules of the Road, and the Roadmap guide for team managers. Log in with the account you get once your team is registered.",
  },
];
