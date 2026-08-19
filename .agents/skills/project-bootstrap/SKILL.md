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

2. If that final test succeeds, do not reinstall dependencies.

3. If it fails, run:

```bash
npm ci --include=optional
```

Use `npm ci`, not `npm install`. The optional flag preserves the locked `@rolldown/binding-*` packages required by this Astro 5 setup.

4. Report the installed runtime versions:

```bash
node --version
npm --version
```

5. If installation cannot access the network, request the client-specific network approval. Do not change the lockfile or upgrade Astro as a workaround.
