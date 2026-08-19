// Program cards shown on the /events hub. Routine edits live here: update
// a card's `when`/`blurb` as seasons change, or add/remove cards. The page
// layout is in src/pages/events.astro.

export interface ProgramCard {
  href: string;
  name: string;
  when: string;
  cta: string;
  headline: string;
  blurb: string;
  color: "red" | "cyan" | "purple";
  src: string;
  caption: string;
  alt: string;
  tilt: "left" | "right";
  tape: "none" | "left" | "right";
}

export const programs: ProgramCard[] = [
  {
    href: "/events/maker-faire",
    name: "School Maker Faire",
    when: "Each May",
    cta: "See the Maker Faire →",
    headline: "Our biggest event of the year.",
    blurb: "K-12 students show what they made all year. Free, open to the public, 11am-3pm at Piedmont High School. The 12th annual just wrapped. Next faire is May 2027.",
    color: "red",
    src: "/img/programs/maker-faire.jpg",
    caption: "Kids at the Maker Faire LEGO play table",
    alt: "Children and parents gathered around a large outdoor LEGO play table at the Piedmont School Maker Faire.",
    tilt: "left",
    tape: "none",
  },
  {
    href: "/events/popup-maker-spaces",
    name: "Popup Maker Spaces",
    when: "Sporadic Saturdays",
    cta: "Catch the next popup →",
    headline: "Hands-on workshops, drop in and make.",
    blurb: "A few times a year we open a space and load it with tools: soldering irons, sewing machines, 3D printers, hot glue, cardboard. Watch the newsletter for the next date.",
    color: "cyan",
    src: "/img/programs/popup.jpg",
    caption: "Kids and parents making at a popup maker space",
    alt: "Children and parents at long tables making craft projects with paper, markers, and cardboard inside a community hall.",
    tilt: "right",
    tape: "left",
  },
  {
    href: "/events/build-like-a-girl",
    name: "Build Like a Girl",
    when: "Multiple sessions",
    cta: "How mentoring works →",
    headline: "Inspiring girls in STEAM.",
    blurb: "Mentored by the older female students from our FTC and FRC teams. A confidence-and-tools program: hands-on robotics taught by girls who've been doing it for years.",
    color: "purple",
    src: "/img/programs/build-like-a-girl.jpg",
    caption: "Older FRC students demoing a robot to a crowd of younger girls",
    alt: "High school students in purple Piedmont Makers sweatshirts demonstrating a robot to a crowd of young girls.",
    tilt: "left",
    tape: "right",
  },
  {
    href: "/events/fourth-of-july-parade",
    name: "4th of July Parade",
    when: "July 4 each year",
    cta: "March with us →",
    headline: "Our 15-foot robot down Highland Ave.",
    blurb: "FRC Team 8033 drives the parade robot. Robotics teams march. We took home the Highland Cup in 2025 after placing 2nd in 2024. Spectators in lawn chairs encouraged.",
    color: "red",
    src: "/img/programs/july-4.jpg",
    caption: "Piedmont Makers crew with the inflatable Makey on Highland Ave",
    alt: "A large group of Piedmont Makers kids and parents in matching shirts posing with the Piedmont Makers banner in front of a 15-foot inflatable red Makey robot on Highland Avenue.",
    tilt: "right",
    tape: "none",
  },
  {
    href: "/di",
    name: "Destination Imagination",
    when: "Pilot · Fall 2026",
    cta: "Meet the DI pilot →",
    headline: "Creative problem-solving as a team sport.",
    blurb: "Teams of up to 7 kids pick an open-ended challenge each fall, build a solution over the school year, and present it at a spring tournament. Grades 3-8 for the pilot year. In partnership with Cal DI.",
    color: "cyan",
    src: "/img/programs/di-students-tournament.jpg",
    caption: "DI team members at a tournament",
    alt: "Three young girls in white lab coats decorated with handmade patches, watching attentively at a Destination Imagination tournament.",
    tilt: "left",
    tape: "right",
  },
  // After-School Enrichment paused for Fall 2026; restore this card if it
  // comes back in winter 2026-27 or a later session. The detail page
  // (/events/after-school) still exists but isn't linked from here.
  // {
  //   href: "/events/after-school",
  //   name: "After-School Enrichment",
  //   when: "PUSD elementary schools",
  //   cta: "See the programs →",
  //   headline: "Hands-on STEAM, after the school day.",
  //   blurb: "Tinker Toy Lab (Grades 1-5) and Maker Invention Studio (Grades 3-5). Piloted at Beach Elementary; expanding to more PUSD elementary schools.",
  //   color: "cyan",
  //   src: "/img/programs/popup.jpg",
  //   caption: "After-school enrichment, kids making with paper, markers, and cardboard",
  //   alt: "Children at long tables making craft projects in an after-school enrichment session.",
  //   tilt: "left",
  //   tape: "right",
  // },
];
