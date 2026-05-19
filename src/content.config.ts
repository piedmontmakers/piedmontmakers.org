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
    // Path relative to /public, e.g. /img/blog/post-slug/hero.jpg. Will be
    // prefixed with import.meta.env.BASE_URL at render time.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroImageCaption: z.string().optional(),
  }),
});

// Dated happenings — FTC matches, FLL scrimmages, Maker Faire dates,
// popup maker space sessions, Build Like a Girl sessions, the 4th of
// July parade, robotics kickoffs/championships. Each instance is its
// own file in src/content/events/ named YYYY-MM-DD-slug.md.
// Per-event call-to-action. Most events have 1, some have 2-3 (Maker Faire has
// tickets + volunteer + exhibit). Types are styled consistently; label can be
// overridden when the default doesn't read right.
const eventActionSchema = z.object({
  type: z.enum(["tickets", "register", "volunteer", "exhibit", "info"]),
  url: z.string(),
  label: z.string().optional(),
});

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
    summary: z.string().optional(),
    actions: z.array(eventActionSchema).optional(),
  }),
});

export const collections = { blog, events };
