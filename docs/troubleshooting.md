# Troubleshooting

## Dependencies and clean installs

Use `npm run bootstrap`. It runs the locked install with optional dependencies
and tells Sharp to use its bundled binaries instead of a machine's global libvips.
The plugin's developer tools are pinned; update them deliberately and verify both
client configurations together.

When adding a dependency, inspect the lockfile diff for removed native bindings,
then run `npm run bootstrap` and `npm run verify`. A successful install in an old
node_modules directory is not sufficient. npm 11 has removed optional binding
entries during installs in this project. Preserve the existing locked versions
and integrity metadata when repairing that loss; do not delete the lockfile and
silently upgrade the dependency tree.

Install the browser with `npx playwright install chromium` locally. CI uses
`npx playwright install --with-deps chromium`. Browser tests own port 4399 and will
fail if it is occupied, rather than test an unrelated preview.

## Deployment failures

A failing verification or deployment leaves the prior site online. Inspect the
GitHub Actions run for the exact commit. Fix the failure or revert the commit;
do not claim a push is deployed until the Pages job succeeds.

## Existing compatibility notes

These describe the current Astro 5 project. Reassess them when deliberately
planning an upgrade; they are not permanent constraints on future versions.

- **Hosted-session shallow clones** can fail the re-sync step with `fatal: refusing to merge unrelated histories`. Fix: `git fetch --unshallow`, then re-run the fetch + `merge --ff-only`.
- **Astro 5, NOT 6.** Astro 6 + `@tailwindcss/vite` triggers the rolldown native-binding bug on macOS-arm64 under npm 11.
- **`501(c)(3)` renders as `501©(3)`.** Manrope substitutes the `(c)` glyph sequence to © via an OpenType feature that `font-feature-settings: "ss02"` (dropping ss01) doesn't reach. The bulletproof fix: zero-width non-joiner between `(` and `c`. Use `&zwnj;` in template text, U+200C literal `‌` in TS strings. Follow the pattern for anything a visitor reads. **Deliberate exception: JSON-LD.** `orgSchema` in `BaseLayout.astro` uses a plain `501(c)(3)` on purpose, because structured data is never rendered and the invisible character would only pollute text that agents read literally. Don't "fix" it. `scripts/check-agent-readiness.mjs` enforces the zero-width joiner in *visible* text only, so it won't catch you either way.
- **`@astrojs/rss` is not installed.** Its install path drops the `@rolldown` optional bindings (see above). RSS is hand-rolled in `src/pages/rss.xml.ts`. If you change the feed, edit that file; don't reach for the package.
- **Tailwind arbitrary `grid-cols`** uses underscores between values, not commas: `grid-cols-[80px_1fr]` works; `grid-cols-[80px,1fr]` silently fails to a single column.
- **YAML dates parse as midnight UTC.** When formatting for display use `getUTCDate()` / `timeZone: "UTC"` so day numbers don't shift backward on the West Coast.
- **`base` path matters** for internal links. Use the `link()` / `asset()` helpers that strip the trailing slash and prepend `BASE_URL`. With `USE_CUSTOM_DOMAIN=true` (apex deploy, current state) the base is `/`; locally without the env var, it's `/piedmontmakers.org/`. Dynamic endpoints (`rss.xml.ts`, `robots.txt.ts`, `llms.txt.ts`) compose absolute URLs by concatenating `context.site` + `import.meta.env.BASE_URL` so they work in either mode.
- **Image paths and links in Markdown body** must be root-relative (`/img/...`, `/robotics`) because the Markdown pipeline doesn't run the resolver and the production deploy uses `base: '/'`. A hardcoded `/piedmontmakers.org/...` body path 404s on the live apex site. (This reversed when the site moved from the GH Pages subpath to the apex domain.) The default `npm run dev` uses the same apex paths as production. A deliberately configured subpath preview cannot resolve root-relative Markdown links.

