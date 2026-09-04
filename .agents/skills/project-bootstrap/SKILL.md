---
name: project-bootstrap
description: Use when this repository is missing node_modules, npm scripts fail because dependencies are absent or incomplete, or a fresh checkout needs preparation before checks or development.
---

# Bootstrap the Project

Run from the repository root. Do not modify `package.json` or `package-lock.json`.

1. Resolve the root and inspect dependency state:

```bash
repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"
test -d node_modules && test -f node_modules/.package-lock.json
```

2. If that final test succeeds and `npm run check` works, do not reinstall. A present node_modules directory alone does not prove native dependencies are usable.

3. If it fails, run:

```bash
npm run bootstrap
```

The bootstrap script owns dependency recovery. It uses npm ci with optional dependencies and Sharp bundled binaries; see `docs/troubleshooting.md`.

4. Report the installed runtime versions:

```bash
node --version
npm --version
```

5. If installation cannot access the network, request the client-specific network approval. Do not change the lockfile or upgrade Astro as a workaround.
