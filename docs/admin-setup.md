# Blog CMS setup (Sveltia CMS)

The `/admin/` URL on this site is **Sveltia CMS**, a git-based CMS that lets you write blog posts in a friendly UI and commits them back to the repo. It runs entirely client-side as two static files: `public/admin/index.html` (the bootstrap) and `public/admin/config.yml` (what to edit, how to lay out the form).

What's NOT in the repo, and has to be set up once per project:
1. A **GitHub OAuth App** that lets the CMS sign editors in
2. A small **OAuth proxy** that holds the OAuth client secret server-side (Sveltia can't do PKCE yet, so a proxy is required)

This doc walks through both.

## 1. Register a GitHub OAuth App

Go to **GitHub → Piedmont Makers org → Settings → Developer settings → OAuth Apps → New OAuth App**.

| Field | Value |
|---|---|
| Application name | `Piedmont Makers Blog CMS` |
| Homepage URL | `https://piedmontmakers.github.io/piedmontmakers.org/` (or apex when cut over) |
| Authorization callback URL | **Filled in after step 2.** Leave blank for now and come back. |

Click **Register application**. On the resulting page:
- Copy the **Client ID** — you'll paste it into the Worker config in step 2.
- Click **Generate a new client secret**, copy that too. Don't paste it anywhere except the Worker config.

Leave this tab open.

## 2. Deploy the Sveltia OAuth proxy (Cloudflare Worker)

The Sveltia maintainers ship a tiny Cloudflare Worker for this: <https://github.com/sveltia/sveltia-cms-auth>.

1. Click the **"Deploy to Cloudflare Workers"** button in that README. (You'll need a free Cloudflare account; sign up takes ~2 minutes.)
2. Cloudflare prompts for a worker name. Default is fine (`sveltia-cms-auth`). Pick a subdomain.
3. After deploy, go to the Worker's **Settings → Variables and Secrets** and add:
   - `GITHUB_CLIENT_ID` → the client ID from step 1
   - `GITHUB_CLIENT_SECRET` → the client secret from step 1 (mark as **Encrypted**)
   - `ALLOWED_DOMAINS` → `piedmontmakers.org,piedmontmakers.github.io` (restricts auth to this site)
4. Note your Worker's public URL — it looks like `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev`.

## 3. Connect the pieces

Back in the **GitHub OAuth App** tab from step 1, set the **Authorization callback URL** to:

```
https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev/callback
```

Click **Update application**.

Then in this repo, edit `public/admin/config.yml` and uncomment the `base_url` line, setting it to your Worker's URL:

```yaml
backend:
  name: github
  repo: piedmontmakers/piedmontmakers.org
  branch: main
  base_url: https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev
```

Commit and push. The Action will deploy in ~30s.

## 4. Try it

Open `https://piedmontmakers.org/admin/` (or the staging GH Pages URL while DNS is still pending). You should see a "Sign in with GitHub" button. Click it, approve the OAuth app, and you'll land in the CMS.

## Who can edit?

Anyone who:
- Has a GitHub account, AND
- Has push access to the `piedmontmakers/piedmontmakers.org` repo (either as a direct collaborator or as a member of the Piedmont Makers org with the right team membership)

To add an editor: invite them to the org or the repo. To revoke: remove them.

## Troubleshooting

- **"This app is requesting permission to access your account"** the first time you log in — that's normal. Click Authorize.
- **CMS loads but says "Failed to fetch"** — the Worker URL in `config.yml` is probably wrong, or the GitHub OAuth callback URL doesn't match the Worker URL. Both have to agree.
- **Login redirects in a loop** — the Worker's `GITHUB_CLIENT_SECRET` may not have been saved as Encrypted. Re-add it.
- **Editor sees the CMS but can't save** — they don't have push access to the repo. Check their org/team membership.

## What about non-GitHub editors?

Sveltia only supports GitHub/GitLab auth right now. If you ever want to let someone edit without a GitHub account, the move is **TinaCMS** (or a future PKCE/email-based Sveltia release). Not solving that today.
