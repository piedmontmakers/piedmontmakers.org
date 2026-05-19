import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    excerpt: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

// Dated happenings — FTC matches, FLL scrimmages, Maker Faire dates,
// popup maker space sessions, Build Like a Girl sessions, the 4th of
// July parade, robotics kickoffs/championships. Each instance is its
// own file in src/content/events/ named YYYY-MM-DD-slug.md.
const events = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    program: z
      .enum(["robotics", "maker-faire", "popup", "build-like-a-girl", "july-4", "other"])
      .default("other"),
    link: z.string().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = { blog, events };
