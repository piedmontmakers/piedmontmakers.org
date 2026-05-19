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
    // ───── Old Wix top-level page slugs ─────
    // Mapped against the Wix sitemap at www.piedmontmakers.org/sitemap.xml.
    '/community': '/about-us',
    '/copy-of-2023-24-s-t-e-a-m-grants': '/teacher-grants#awards-2023-24',
    '/copy-of-2024-25-s-t-e-a-m-grants': '/teacher-grants#awards-2024-25',
    '/engineering-lab': '/facilities#engineering-lab',
    '/event-list': '/calendar',
    '/general-5': '/teacher-grants#awards-2023-24',
    '/maker-faire-project-ideas': '/events/maker-faire/project-ideas',
    '/meet-the-makers': '/events/maker-faire/meet-the-makers',
    '/school-maker-faire': '/events/maker-faire',
    '/tech-social': '/',
    '/10th-street': '/facilities#tenth-street',
    // Note: Wix `/events` (their event listing page) cannot redirect to
    // `/calendar` because `/events` is now our real Events hub (formerly
    // /programs). Visitors with stale Wix /events bookmarks land on Events
    // instead — close enough in spirit.

    // ───── Migrated Wix blog posts (the 4 we ported) ─────
    '/post/highlander-robotics-team-8033-update-april-2026': '/blog/2026-04-21-highlander-robotics-april-update',
    '/post/advanced-robotics-open-house': '/blog/2026-04-20-advanced-robotics-open-house',
    '/post/first-tech-challenge-registration-now-open': '/blog/2026-04-20-ftc-registration-open',
    '/post/updates-from-first-and-lego': '/blog/2026-03-19-first-and-lego-update',

    // ───── Unmigrated Wix blog posts — route to the topical page where
    // the content best fits, falling back to /blog. ─────
    '/post/highlander-robotics-team-8033-update-feb-2025': '/robotics#frc',
    '/post/highlander-robotics-team-8033-update-march-2026': '/robotics#frc',
    '/post/east-bay-hills-ftc-league-season-recap': '/robotics#ftc',
    '/post/first-tech-challenge-registration-now-open-2': '/robotics#ftc',
    '/post/lego-robotics-registration-open-for-fall-2026-season': '/robotics#fll-explore',
    '/post/robotics-open-house-7pm-march-24': '/robotics',
    '/post/makerspace-pop-up-event-march-21': '/events/popup-maker-spaces',
    '/post/save-the-date-12th-annual-piedmont-school-maker-faire': '/events/maker-faire',
    '/post/2026-steam-summer-camp-registration-is-open': '/events/after-school',

    // ───── Wix /event-details/ pages ─────
    '/event-details/advanced-robotics-open-house': '/blog/2026-04-20-advanced-robotics-open-house',

    // ───── Pre-2026-05 nav-rename slugs (Events↔Calendar, Programs→Events,
    // Grants→Teacher Grants, About→About Us). Keep so any bookmark or
    // share link from before the rename lands correctly. ─────
    '/about': '/about-us',
    '/grants': '/teacher-grants',
    '/programs': '/events',
    '/programs/after-school': '/events/after-school',
    '/programs/build-like-a-girl': '/events/build-like-a-girl',
    '/programs/fourth-of-july-parade': '/events/fourth-of-july-parade',
    '/programs/maker-faire': '/events/maker-faire',
    '/programs/popup-maker-spaces': '/events/popup-maker-spaces',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});