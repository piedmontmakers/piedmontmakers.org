// Robotics program levels shown on /robotics. Routine edits live here:
// toggle a level's `registerOpen` when sign-ups open or close, swap
// TeamSnap `register` URLs, and update `coachTraining` / open-house deck
// links each season. The page layout itself is in src/pages/robotics.astro.

export type LevelColor = "red" | "cyan" | "purple" | "ink";

export interface RoboticsLevel {
  slug: string;
  name: string;
  ageLabel: string;
  season: string;
  cadence: string;
  teamSize: string;
  cost: string;
  blurb: string;
  /** May contain inline HTML links. */
  detail: string;
  color: LevelColor;
  register: string;
  /** Omit (or true) = registration open; false shows the closed ribbon. */
  registerOpen?: boolean;
  registerClosedLabel?: string;
  openHousePresentation?: string;
  openHouseLabel?: string;
  coachTraining?: string;
  photoAlbum?: string;
  photoAlbumLabel?: string;
  detailLink?: string;
  detailLinkLabel?: string;
  photoCaption: string;
  photoSrc: string;
  photoAlt: string;
}

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

// - the K–8 open-house deck covers FLL Explore + FLL Challenge
const FLL_OPEN_HOUSE = "https://docs.google.com/presentation/d/1_HkY0Hny-GwCP15v0RREwJrp2LgjbV0jnYSsxrxopLs/preview";

export const levels: RoboticsLevel[] = [
  {
    slug: "fll-explore",
    name: "LEGO League Explore",
    ageLabel: "Grades K–3",
    season: "Aug–Dec",
    cadence: "1× weekly · 1 hour",
    teamSize: "5–6 kids",
    cost: "$200 / participant",
    blurb: "Your kid's first robot. Kindergartners through 3rd graders build with LEGO Spike Essentials and code with drag-and-drop blocks. Motors, sensors, no fear.",
    detail: "Teams of 5–6 kids meet at a coach's home for 12 weekly hour-long sessions, then present their build and poster at the LEGO League Explore Festival at Piedmont Middle School the weekend after Thanksgiving. Two parent volunteers coach each team. Piedmont Makers supplies the LEGO kit, week-by-week lesson plans, August coach training, and an active Slack channel for coaches who haven't done this before.",
    color: "red",
    register: "https://go.teamsnap.com/forms/514678",
    registerOpen: false,
    registerClosedLabel: "Registration closed",
    openHousePresentation: FLL_OPEN_HOUSE,
    coachTraining: "https://docs.google.com/presentation/d/1C4xS8fyIxAjB8SaPO-r-16SQq_lEzQgKsjWZrS8HnUY/preview",
    photoCaption: "LEGO League Explore team building during a session",
    photoSrc: "/img/robotics/fll-explore.jpg",
    photoAlt: "Four young boys in purple Piedmont Makers shirts sitting on the floor of a gym building LEGO Technic structures together.",
  },
  {
    slug: "fll-challenge",
    name: "LEGO League Challenge",
    ageLabel: "Grades 4–8",
    season: "Aug–Dec",
    cadence: "1–2× weekly · 2–3 hours total",
    teamSize: "6–8 kids",
    cost: "$400 / participant",
    blurb: "4th–8th graders build autonomous LEGO robots, code in block programming or Python, and research a real-world problem for their Innovation Project.",
    detail: "Teams of 6–8 meet 1–2 times a week from August through December. The season ends at the Piedmont Makers Community Tournament at Piedmont Middle School: 12 game tables, two arenas, real referees, awards including Best Costume. Teams who want more can opt into the Competitive Track for regional qualifiers in January and February. Piedmont Makers delivers a 4'×8' game table to the coach's house and supplies the LEGO Spike Prime kits, week-by-week guides, August coach training, and a Slack community of 130+ coaches.",
    color: "cyan",
    register: "https://go.teamsnap.com/forms/514677",
    registerOpen: false,
    registerClosedLabel: "Registration closed",
    openHousePresentation: FLL_OPEN_HOUSE,
    photoAlbum: "https://photos.google.com/share/AF1QipOdThkPPSUpe22y62V5_eHW0HFRk2K2iVP6H9ibgbnKws4UnmwwC56gP-b_PNBJUA?key=WUdqR2ZtN25rdFBuNk1la1ZJckdGdkIteHgxX1Bn",
    coachTraining: "https://docs.google.com/presentation/d/1F6n4EAYSiCuUXOVLcecq45sDepXOOqN_GYA6CAIfs4Y/preview",
    photoCaption: "LEGO League Challenge team at the SUBMERGED season tournament",
    photoSrc: "/img/robotics/fll-challenge.jpg",
    photoAlt: "Five girls in maroon Piedmont Makers shirts working at a FLL Challenge competition table with a LEGO ocean-themed game board.",
  },
  {
    slug: "ftc",
    name: "FTC — FIRST Tech Challenge",
    ageLabel: "Grades 7–12",
    season: "Sept–Feb",
    cadence: "2× weekly · 2–6 hrs",
    teamSize: "6–12 kids",
    cost: "$500 / participant",
    blurb: "From LEGO to metal. 7th–12th graders build 18-inch-cube robots from REV, TETRIX, and goBILDA components, code them in Java, and compete in two-robot alliances on a 12'×12' field.",
    detail: "Teams of 6–12 kids practice at coach/parent homes or our robotics practice facility in Oakland, learning Java programming, CAD, and digital fabrication along the way. They compete in the East Bay Hills FTC League qualifying tournaments. Many teams bring on a Highlander Robotics high schooler as a student mentor so a non-STEAM parent can still run a strong team.",
    color: "purple",
    register: "https://go.teamsnap.com/forms/518591",
    registerOpen: false,
    registerClosedLabel: "Registration closed",
    openHousePresentation: "https://docs.google.com/presentation/d/1plUPHhN3mBLRrkNKo9q8S0FCrr9Wg64-duD7N3sXZSY/preview",
    coachTraining: "https://docs.google.com/presentation/d/1UbYLDkz853m1TtzLKPBUHvZb0MTVOxKOZ2ebqmK7eMw/preview",
    photoCaption: "FTC Team 18133 at robot inspection",
    photoSrc: "/img/robotics/ftc.jpg",
    photoAlt: "Members of FTC Team 18133 in matching green hoodies and safety glasses gathered around their robot at the inspection table at a competition.",
  },
  {
    slug: "frc",
    name: "FRC — Highlander Robotics Team 8033",
    ageLabel: "Grades 9–12",
    season: "Aug–June · build season Jan–March",
    cadence: "Multiple weekly meetings",
    teamSize: "50+ kids",
    cost: "$800 / participant",
    blurb: "The big leagues: 120-pound competition robots, full build season, serious engineering. Team 8033 has reached the FIRST World Championship in Houston four times, most recently in 2025.",
    detail: `Team 8033 has 50+ kids organized into specialty subgroups (mechanical, electrical, software, scouting, fundraising, business) so members can focus on what they love instead of doing everything. Practice happens at our robotics practice <a href='${base}/facilities#tenth-street' class='underline decoration-pm-cyan/40 underline-offset-2 hover:decoration-pm-cyan'>facility</a> in Oakland, the only community-accessible regulation FRC field in the Bay Area. Beyond build season, Team 8033 develops <a href='https://apps.apple.com/us/app/lovat-dashboard/id6467466592' class='underline decoration-pm-cyan/40 underline-offset-2 hover:decoration-pm-cyan'>Lovat</a> (a scouting app used by 800+ FRC teams worldwide), runs the annual a-CAD-emy summer camp teaching middle schoolers Onshape CAD, mentors local LEGO League teams, and shares training programs with 40+ other FRC teams worldwide.`,
    color: "ink",
    register: "https://go.teamsnap.com/forms/523636/signups/new",
    openHousePresentation: "https://www.frc8033.com/faq",
    openHouseLabel: "8033 FAQ →",
    detailLink: "https://frc8033.com",
    detailLinkLabel: "Team site: frc8033.com",
    photoCaption: "Highlander Robotics 8033 huddled around the robot at a tournament",
    photoSrc: "/img/robotics/frc.jpg",
    photoAlt: "Members of Highlander Robotics Team 8033 in purple shirts gathered around their robot at a tournament, with a packed gym of spectators in the bleachers behind them.",
  },
];

// Deck + guide links listed in the "Coach resources" section. `fileType` is the
// kicker shown above each title, so a coach knows what opens before they click.
// Set it to what the link actually serves: "Google Slides", "Google Doc",
// "Google Sheet", "PDF", or "Video".
export const coachResources: { title: string; url: string; fileType: string }[] = [
  { title: "FLL Explore — Coach Training 2026–27", url: levels[0].coachTraining!, fileType: "Google Slides" },
  { title: "FLL Challenge — Coach Training 2026–27", url: levels[1].coachTraining!, fileType: "Google Slides" },
  { title: "FLL Challenge — Team Guide", url: "https://drive.google.com/file/d/1xrDpcz8RXG9l_vbkGpEV1V97VQxlEHaq/view", fileType: "PDF" },
  { title: "FTC — Coach Training 2026–27", url: levels[2].coachTraining!, fileType: "Google Slides" },
  { title: "K–8 Open House Video (2024)", url: "https://drive.google.com/file/d/1HscUEbHs9aavZQEHyHO_LoEQH5HMlBeO/view?usp=sharing", fileType: "Video" },
  { title: "Advanced Robotics Open House (2025)", url: "https://docs.google.com/presentation/d/1JK3Y33ruDgdsjrYd71ltKpQu1yrrQ5-kWpiOF51wQ0s/edit?slide=id.g239b0e0bcf4_0_0", fileType: "Google Slides" },
  { title: "FRC Highlander Robotics 8033 Open House (2025)", url: "https://docs.google.com/presentation/d/1EvarF6RCwFp5Vg8fEj-GUeDI9r2xmpNoWgTcnGgFV5Y/edit?usp=sharing", fileType: "Google Slides" },
];
