import type { APIContext } from "astro";

// llms.txt — an emerging convention for giving LLMs a structured, plaintext
// overview of a site. Generated dynamically so the URLs resolve correctly
// at the current deploy target (GH Pages staging vs. apex domain).
export async function GET(context: APIContext) {
  // Compose absolute URLs that include the base path. Staging deploys
  // sit under /piedmontmakers.org/; the apex domain uses /.
  const baseUrl = (
    (context.site?.toString() ?? "https://piedmontmakers.org/") +
    import.meta.env.BASE_URL.replace(/^\//, "")
  ).replace(/\/$/, "");
  const path = (p: string) => `${baseUrl}${p}`;

  const body = `# Piedmont Makers

> 501(c)(3) nonprofit running FIRST Robotics teams, a community engineering lab, a school maker faire, popup maker spaces, after-school enrichment, and Build Like a Girl across the East Bay. Founded 2014. Largest community-based youth robotics league in the United States — ~1,000 kids on 125+ teams across 90+ schools.

## Programs

- [Robotics](${path("/robotics")}): FIRST Robotics teams from kindergarten through high school. Four levels: FLL Explore (Grades K–3), FLL Challenge (Grades 4–8), FTC FIRST Tech Challenge (Grades 7–12), FRC FIRST Robotics Competition (Grades 9–12, Highlander Robotics Team 8033).
- [Events](${path("/events")}): School Maker Faire (annual May event at Piedmont High School), Popup Maker Spaces, Build Like a Girl, 4th of July Parade, After-School Enrichment.
- [Facilities](${path("/facilities")}): 10th Street regulation FRC field in Oakland; Mary G. Ross Engineering Lab at Piedmont High School.
- [Teacher Grants](${path("/teacher-grants")}): annual STEAM grants to Piedmont Unified School District teachers.

## About

- [About Us](${path("/about-us")}): mission, vision, board of directors, contact information, legal status (501(c)(3), EIN 47-2831568).
- [Blog](${path("/blog")}): news, project recaps, and season updates.
- [Calendar](${path("/calendar")}): upcoming and past events.

## Get involved

- Donate: https://donate.piedmontmakers.org (Square-processed, tax-deductible).
- Newsletter: ${path("/#newsletter")} (Mailchimp, ~one email per month).
- Volunteer: every event has its own signup; see ${path("/events")}.
- Buy a t-shirt: https://www.bonfire.com/piedmont-makers-t-shirt/

## Feeds

- RSS: ${path("/rss.xml")}
- Sitemap: ${path("/sitemap-index.xml")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
