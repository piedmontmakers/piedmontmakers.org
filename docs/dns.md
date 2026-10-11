# DNS and domain

- **Registrar:** Squarespace Domains (migrated from Google Domains).
- **Nameservers:** `ns-cloud-b1`…`b4.googledomains.com`, but records are edited in **Squarespace → Domains →
  piedmontmakers.org → DNS → Custom records**, not in Google Cloud DNS.
- **Checking a change:** Squarespace edits do not bump the SOA serial (it stayed 14 across an added TXT on
  2026-10-11). Query the record itself at the authoritative server:
  `dig +short TXT <name>.piedmontmakers.org @ns-cloud-b1.googledomains.com`
- **GitHub:** the `piedmontmakers` org is domain-verified via TXT `_gh-piedmontmakers-o` (2026-10-11).
