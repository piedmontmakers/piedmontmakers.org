// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Toggle when we cut over to the custom domain piedmontmakers.org.
// Until then, the site is served at https://piedmontmakers.github.io/piedmontmakers.org/
// and needs the base path so internal links resolve.
const USE_CUSTOM_DOMAIN = process.env.USE_CUSTOM_DOMAIN === 'true';

export default defineConfig({
  site: USE_CUSTOM_DOMAIN
    ? 'https://piedmontmakers.org'
    : 'https://piedmontmakers.github.io',

  base: USE_CUSTOM_DOMAIN ? '/' : '/piedmontmakers.org/',
  trailingSlash: 'never',
  integrations: [sitemap()],

  redirects: {
    // Old Wix slugs — preserve inbound links.
    '/copy-of-2024-25-s-t-e-a-m-grants': '/teacher-grants#awards-2024-25',
    '/general-5': '/teacher-grants#awards-2023-24',
    '/community': '/about-us',
    '/engineering-lab': '/facilities#engineering-lab',
    '/10th-street': '/facilities#tenth-street',
    '/tech-social': '/',

    // Old slugs from before the 2026-05 nav rename
    // (Events ↔ Calendar, Programs → Events, Grants → Teacher Grants,
    //  About → About Us). Keep these so any bookmark or stale share link
    //  lands on the right page.
    '/programs': '/events',
    '/programs/maker-faire': '/events/maker-faire',
    '/programs/popup-maker-spaces': '/events/popup-maker-spaces',
    '/programs/build-like-a-girl': '/events/build-like-a-girl',
    '/programs/fourth-of-july-parade': '/events/fourth-of-july-parade',
    '/programs/after-school': '/events/after-school',
    '/grants': '/teacher-grants',
    '/about': '/about-us',
    // Note: cannot redirect `/events` to `/calendar`. `/events` is now the
    // real Events page (formerly /programs). Any link that previously meant
    // the dated-calendar is unfortunately ambiguous after this rename — the
    // bet is that the new content is close enough in spirit that it's fine.
  },

  vite: {
    plugins: [tailwindcss()],
  },
});