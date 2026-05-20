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
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
