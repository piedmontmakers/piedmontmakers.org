# 2026-10-11 — GitHub org domain verification for piedmontmakers.org

## Handoff

- leftovers: none
- repos:
  - /Users/kev/code/makers/piedmontmakers.org → stage `docs/sessions/2026-10-11-github-domain-verification.md` and `CLAUDE.md`; message: "Record where piedmontmakers.org DNS lives (Squarespace) and GitHub org domain verification"
- lessons:
  - target: project — insert into /Users/kev/code/makers/piedmontmakers.org/CLAUDE.md (new section "## DNS", or append to an existing infra/hosting section):
    ```
    ## DNS
    piedmontmakers.org: registrar Squarespace Domains (ex-Google Domains); nameservers ns-cloud-b1..b4.googledomains.com,
    but records are edited in Squarespace → Domains → piedmontmakers.org → DNS → Custom records, not Google Cloud DNS.
    Squarespace edits do NOT bump the SOA serial (stayed 14 across an added TXT, 2026-10-11): verify a change by
    querying the record itself at `@ns-cloud-b1.googledomains.com`, never by the serial.
    GitHub org `piedmontmakers` domain-verified via TXT `_gh-piedmontmakers-o` (2026-10-11).
    ```
    evidence: this note, "Verified".
  - target: global — candidate text:
    ```
    Never put a `<placeholder>` in a shell-tagged block Kevin can Run: zsh reads `<x>` as a redirect and the command
    fails confusingly. Resolve the value first (one cheap lookup), or say in prose what to substitute.
    ```
    evidence: this note, "What went wrong" (2026-10-11, `dig +short TXT _gh-<org>-o…` → "no such file or directory: org"; `gh api user/orgs` would have resolved it).
- focus: done session:local_0351f5ab-2a07-49df-8453-8bf01b905eca --why "piedmontmakers.org GitHub verification: TXT _gh-piedmontmakers-o added in Squarespace by Kevin, live at authoritative NS and GitHub org is_verified=true (2026-10-11)"
- verified: 2026-10-11 re-pulled: `dig TXT _gh-piedmontmakers-o.piedmontmakers.org @ns-cloud-b1.googledomains.com` → "defd36981b" (also via default resolver); `gh api orgs/piedmontmakers` → is_verified: true; SOA serial still 14.

## What happened

- Asked where piedmontmakers.org DNS is served, to add a GitHub verification TXT.
- NS = ns-cloud-b1..b4.googledomains.com; whois registrar Squarespace Domains II LLC. Existing TXT: google-site-verification, SPF (`include:_spf.google.com`).
- Kevin added the record in Squarespace; first check (authoritative) was NXDOMAIN, i.e. not yet saved; after he saved, it went live.

## What went wrong

- I gave Kevin a runnable `dig … _gh-<org>-o…` block; zsh parsed `<org>` as a redirect. Should have resolved the org (`gh api user/orgs` → `piedmontmakers`) first.
- I told Kevin the SOA serial would rise past 14 when the edit landed; it did not (Squarespace doesn't bump it). The record check is the only reliable signal.
