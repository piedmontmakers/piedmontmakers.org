# Claude Code

@AGENTS.md

## DNS

piedmontmakers.org: registrar Squarespace Domains (ex-Google Domains); nameservers ns-cloud-b1..b4.googledomains.com,
but records are edited in Squarespace → Domains → piedmontmakers.org → DNS → Custom records, not Google Cloud DNS.
Squarespace edits do NOT bump the SOA serial (stayed 14 across an added TXT, 2026-10-11): verify a change by
querying the record itself at `@ns-cloud-b1.googledomains.com`, never by the serial.
GitHub org `piedmontmakers` domain-verified via TXT `_gh-piedmontmakers-o` (2026-10-11).
