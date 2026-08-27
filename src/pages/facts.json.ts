import type { APIContext } from "astro";
import { stats } from "../data/stats";
import { board, boardMemberCount } from "../data/board";
import {
  grants_2025_26,
  grants_2024_25,
  grants_2023_24,
  totalAwarded,
  totalProjects,
} from "../data/teacher-grants";
import { levels } from "../data/robotics-levels";
import { programs } from "../data/programs";

// facts.json — the machine-readable org-facts contract, compiled from the same
// src/data/ files the pages render. Agents (the piedmontmakers/agents hub's
// pm-context plugin, and anything else) fetch this instead of copying numbers,
// so published facts have one source that can't drift. The shape is contract-
// checked by scripts/check-agent-readiness.mjs on every deploy; bump
// schemaVersion on breaking shape changes.
//
// Like the JSON-LD orgSchema, this is machine-read and never rendered, so the
// EIN and "501(c)(3)" stay plain — no zero-width non-joiner here.
export async function GET(context: APIContext) {
  const baseUrl = (
    (context.site?.toString() ?? "https://piedmontmakers.org/") +
    import.meta.env.BASE_URL.replace(/^\//, "")
  ).replace(/\/$/, "");
  const path = (p: string) => `${baseUrl}${p}`;

  const facts = {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    organization: {
      name: "Piedmont Makers",
      legalStatus: "501(c)(3)",
      ein: "47-2831568",
      founded: 2014,
      missionStatement: {
        canonicalUrl: path("/about-us"),
      },
      urls: {
        site: baseUrl,
        donate: "https://donate.piedmontmakers.org",
        contact: "mailto:hello@piedmontmakers.org",
        llms: path("/llms.txt"),
        calendar: path("/calendar.ics"),
        rss: path("/rss.xml"),
      },
    },
    stats: {
      precision: "display",
      note: "Rounded display values, exactly as published on the site.",
      values: stats,
    },
    teacherGrants: {
      precision: "exact",
      totalAwarded,
      totalProjects,
      years: [
        { year: "2025-26", ...pick(grants_2025_26) },
        { year: "2024-25", ...pick(grants_2024_25) },
        { year: "2023-24", ...pick(grants_2023_24) },
      ],
      detailUrl: path("/teacher-grants"),
    },
    board: {
      memberCount: boardMemberCount,
      ...board,
    },
    programs: programs.map((p) => ({ name: p.name, when: p.when, url: path(p.href) })),
    roboticsLevels: levels.map((l) => ({
      slug: l.slug,
      name: l.name,
      grades: l.ageLabel,
      season: l.season,
      cadence: l.cadence,
      teamSize: l.teamSize,
      cost: l.cost,
      registerOpen: l.registerOpen !== false,
      registerUrl: l.register,
    })),
  };

  return new Response(JSON.stringify(facts, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// Per-year summary: totals only; the itemized awards stay on /teacher-grants.
function pick(y: { total: string; schools: number; projects: number }) {
  return { total: y.total, schools: y.schools, projects: y.projects };
}
