# Workshop: editing piedmontmakers.org with Claude

Plan and materials for the virtual onboarding workshop. Audience ranges from "comfortable with git" to "heard of GitHub, never used a command line." Most attendees will use Claude Code on the web; a few technical folks may set up locally.

## Attendee checklist (before the session)

Everything here happens before the call so the session is spent editing, not installing.

1. **Create a GitHub account** at github.com if you don't have one, and **turn on two-factor authentication** (Settings → Password and authentication). GitHub requires 2FA for contributors, and setting up an authenticator mid-call stalls everything.
2. **Send your GitHub username to the workshop host**, then **accept the repository invitation** that arrives by email. The invite expires if it sits unaccepted, and access is what makes everything else work.
3. **Have a paid Claude account and confirm you can log in** at claude.ai. The repo asks for the Opus model by default; if your plan doesn't include Opus, picking Sonnet when prompted is fine. Don't use a "fast" or "mini" model for site edits.
4. **Open [claude.ai/code](https://claude.ai/code) once and connect your GitHub account** when it offers. Doing the authorization dance ahead of time surfaces any account hiccups while there's time to fix them.
5. **Optional, for the locally-inclined:** install the tools listed in the setup section of [docs/editing-guide.md](editing-guide.md) (git, Node, jq, Claude Code), clone the repo, and run `npm run bootstrap` — all before the call. Big downloads during a live session are a time sink even on good wifi.
6. **Skim [docs/editing-guide.md](editing-guide.md)** (10 minutes). It covers everything the workshop demonstrates.
7. **Join from a computer, not a phone or tablet**, and if you have a second monitor, use it — you'll want the video call and your own Claude session visible at once.

## Host checklist (before the session)

1. Collect usernames, send repo invites, and confirm each one was **accepted** (repo → Settings → Collaborators shows pending invites).
2. **Pre-approve the Claude GitHub App for the piedmontmakers org.** When a non-admin connects GitHub at claude.ai/code, access to an org-owned repo can sit waiting on an org admin's approval of the app installation. If that approval is pending during the workshop, every web session is blocked. Test with a non-admin account.
3. **Prepare one real, small task per attendee**, all green-zone. Every push goes live, so first pushes should be genuine contributions: upcoming calendar events, a stat update, a coach-deck link swap, a short blog recap. Keep the list in a shared doc with the facts each task needs (dates, URLs, names).
4. **Run one fresh web session end-to-end** a day or two before, since the hosted environment evolves.
5. Have a local session ready with browser verification working (the shipped Chrome-DevTools MCP or the Chrome extension), to demonstrate what local sessions can do that web sessions can't.

## Concepts to cover

One short segment at the top of the session, roughly a paragraph of speaking per concept.

**Git.** A save-history system for files. Every change ever made to the website is recorded as a snapshot with an author, a timestamp, and a short description, going back to the project's first day. This is the reason nobody can really break anything: any earlier version of any file can be brought back. You'll never use git directly — Claude operates it for you — but two words are worth recognizing when they scroll by: a *commit* is one saved change, and a *push* publishes your commits.

**GitHub.** The website where that save-history lives, at github.com/piedmontmakers/piedmontmakers.org. Think of it as a shared folder crossed with a change log: it holds the files, records who changed what, and controls who's allowed to make changes — which is why you need an account and an invitation. Everything on it is visible; nothing about our site is hidden in someone's laptop.

**GitHub Pages.** The free GitHub service that turns our folder of files into the live website. A robot watches the shared folder, and about a minute after any change lands, piedmontmakers.org reflects it. There is no publish button and no review queue — pushing *is* publishing. Automated checks run first, and a change that would break the site is rejected while the old site stays up, so "broken" isn't a thing that ships; at worst, "wrong" ships for a few minutes until someone reverts it.

**Astro.** The tool that assembles our files into web pages. Calendar events and blog posts are small text files; page layouts are templates; Astro combines them at publish time. Nobody in this room needs to learn it — Claude knows it thoroughly — but now the words "Astro" and "build" won't be mysterious when they appear in Claude's progress messages.

**Claude vs. Claude Code vs. Claude Code on the web.** Claude is the assistant you may already chat with at claude.ai. Claude Code is the version of Claude that can work with files and run tools — which is what editing a website requires. It comes in two forms: on the web at claude.ai/code, where sessions run in the cloud and you install nothing (this is what most of us will use), and installed on your laptop, which adds a live preview of the site and lets Claude look at pages in a browser before publishing. Same assistant, same rules, same repository either way.

**Why this is safe.** Changes go live in a minute with no human review, and that's less scary than it sounds because four layers back you up: every change is recoverable from history, every change is attributed to the person who made it, automated checks stop anything that would break the site, and the genuinely risky files make Claude stop and ask before touching them. The worst realistic outcome is a typo being public for a few minutes.

**Edit zones.** The repo sorts files by blast radius. Content — calendar events, blog posts, stats, links, wording — is green: edit freely, this is almost everything you'll ever do. Page structure is yellow: normal care. Site-wide design, brand colors, navigation, and configuration are red: Claude will stop and ask "are you sure?" before touching them. Unless changing one of those was the whole point of your request, the answer is no, followed by a message to an admin.

**What a good prompt looks like.** Give Claude the facts, not instructions about files or code: "Add an event to the calendar: FLL scrimmage at Havens Elementary, March 14, 10am to 2pm, registration link is <url>." Claude finds the right files, follows the site's conventions, runs the checks, and shows you what it did before publishing. Your job is supplying accurate dates, links, and names, and reading the summary before saying yes.

## Session outline (suggested, ~75 minutes)

1. **Concepts** (15 min) — the segment above.
2. **Live demo** (15 min) — host runs a web session start to finish: open claude.ai/code, pick the repo, prompt a real calendar edit, watch Claude work, see the deploy go green, reload the live site.
3. **Hands-on** (35 min) — each attendee takes their prepared task and runs their own session. Host screen-shares troubleshooting as questions come up. Everyone ends having genuinely improved the live site.
4. **Wrap** (10 min) — where the docs live ([editing-guide.md](editing-guide.md)), what to do when Claude warns about a red-zone file, how to ask for a revert, and the difference between what web and local sessions can verify.

## Known friction points, from experience

- **A pending org approval of the Claude GitHub App** blocks every web session. Resolve before the call (host checklist item 2).
- **An unaccepted repo invite** looks like "repository not found" to the attendee. The pre-call confirmation pass catches it.
- **Model selection**: attendees whose plan lacks Opus see a model prompt on first session. Picking Sonnet is correct and worth saying out loud.
- **Web sessions can't see pages.** They verify that the site builds, not how it looks. Visual work belongs in a local session or gets eyeballed on the live site right after the push.
- **If Claude ends a web session mentioning a branch or pull request**, the change is not live. Send the session link to an admin rather than assuming it published.
