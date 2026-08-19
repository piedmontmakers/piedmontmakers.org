// FAQ entries for /robotics. Answers may contain inline HTML (links,
// <strong>). Add, remove, or reword freely; the page renders whatever is
// in this list, in order.

export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: "Do you accept kids who don't live in Piedmont?",
    a: "Yes. Our programs are open to East Bay students: Oakland, Berkeley, Lamorinda, and beyond.",
  },
  {
    q: "Does my kid need engineering experience to join?",
    a: "No. We provide guided lesson plans, tutorials, annual coach training, a coach Slack channel, practice table access, and uniforms. Every level is designed to be the on-ramp for someone, not a graduate seminar.",
  },
  {
    q: "Do coaches need engineering experience?",
    a: "Also no. Coaches are parent volunteers. We run annual coach training and supply lesson plans, tutorials, and a Slack channel. For FTC, non-STEAM coaches often hire a high school student mentor to handle the engineering side.",
  },
  {
    q: "We don't have a team yet. Can my kid still register?",
    a: "Yes. The strongest path is for pre-formed teams with named coaches to register together, but if you sign up individually we'll place your kid on a team during the summer.",
  },
  {
    q: "My kid is in 7th or 8th grade. Should they do LEGO League Challenge or FTC?",
    a: "Either works. LEGO League Challenge with the Python option is a great middle ground; FTC is the right call if your kid is ready for Java and a longer season. We're happy to talk it through. Email <a href=\"mailto:robotics@piedmontmakers.org\" class=\"font-display font-semibold underline underline-offset-4 decoration-pm-red hover:text-pm-red\">robotics@piedmontmakers.org</a>.",
  },
  {
    q: "My kid is in high school. FTC or FRC?",
    a: "FTC is smaller-scale (7–12 kids per team, Rev/TETRIX/goBILDA components, Java) and has a shorter season. FRC is the full-scale program: 120-pound robots, all-out build season, big team. Many kids do FTC first and graduate to FRC.",
  },
  {
    q: "What does it cost, and what is included?",
    a: "LEGO League Explore $200, LEGO League Challenge $400, FTC $500, FRC $800. Cost covers FIRST registration, kits/parts, uniform, competition fees, and coach training. <strong>Financial aid is available; cost should not be a barrier.</strong> Email <a href=\"mailto:robotics@piedmontmakers.org\" class=\"font-display font-semibold underline underline-offset-4 decoration-pm-red hover:text-pm-red\">robotics@piedmontmakers.org</a> in confidence.",
  },
  {
    q: "When do registrations open?",
    a: "LEGO League sign-ups run March through May for the fall season. FTC and FRC open later, running into the summer. Each level above shows whether its sign-ups are open right now, and the newsletter carries the exact dates each spring.",
  },
  {
    q: "I heard FIRST and LEGO are ending their partnership. What happens to LEGO League?",
    a: "Our Fall 2026 LEGO League season runs as planned. After the 2026–2027 season, FIRST and LEGO will each develop independent programs. We'll evaluate options for 2027 and beyond as both organizations share more details. Our commitment doesn't change. We'll continue to offer the same level of student-centered, community-based STEAM programs.",
  },
];
