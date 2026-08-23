import type { APIContext } from "astro";

// Dynamic robots.txt so the sitemap URL stays correct whether we're
// serving from the GitHub Pages staging URL or the apex domain.
export async function GET(context: APIContext) {
  // robots.txt always lives at the origin root, so the Sitemap line
  // needs the full URL including any base path.
  const baseUrl = (
    (context.site?.toString() ?? "https://piedmontmakers.org/") +
    import.meta.env.BASE_URL.replace(/^\//, "")
  ).replace(/\/$/, "");
  // Disallow paths are origin-relative, so they need the base path too:
  // "/admin/" on the apex domain, "/piedmontmakers.org/admin/" on staging.
  const basePath = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const body = [
    "User-agent: *",
    "Allow: /",
    // The Sveltia CMS shell. It's a static login page with no content of its
    // own, so indexing it only puts an admin login in search results.
    // Crawlers resolve the longest matching rule, so this beats "Allow: /".
    `Disallow: ${basePath}admin/`,
    "",
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
