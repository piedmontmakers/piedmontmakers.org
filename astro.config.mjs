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
    // Preserve inbound links from the old Wix slugs.
    '/copy-of-2024-25-s-t-e-a-m-grants': '/grants#awards-2025-26',
    '/general-5': '/grants#awards-2023-24',
    '/community': '/about',
    '/engineering-lab': '/facilities#engineering-lab',
    '/10th-street': '/facilities#tenth-street',
    '/tech-social': '/',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});