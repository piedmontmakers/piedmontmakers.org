# piedmontmakers.org

Source for [piedmontmakers.org](https://piedmontmakers.org), the website of Piedmont Makers, a 501(c)(3) nonprofit supporting STEAM education and maker culture in Piedmont, California.

## Stack

- [Astro](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com) — styling
- Markdown content collections for the blog
- GitHub Pages hosting (auto-deployed via Actions on push to `main`)

## Local development

```sh
npm install
npm run dev
```

The site runs at <http://localhost:4321>.

## Build

```sh
npm run build
npm run preview
```

## Editing content

- **Pages** live in `src/pages/` as `.astro` files.
- **Blog posts** live in `src/content/blog/` as Markdown files with frontmatter.
- **Images** live in `public/img/`.
- **Shared layout/nav/footer** live in `src/layouts/` and `src/components/`.

Push to `main` and the site redeploys automatically.

## Deployment

The site is currently served from <https://piedmontmakers.github.io/piedmontmakers.org/> while we stage the rebuild. When ready, we'll point the apex `piedmontmakers.org` DNS at GitHub Pages and toggle `USE_CUSTOM_DOMAIN=true` in the build environment so `base` becomes `/`.
