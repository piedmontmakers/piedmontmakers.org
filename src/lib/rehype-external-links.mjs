// Opens every external http(s) link in Markdown content (blog posts, src/copy)
// in a new tab, the same rule externalLinkAttrs() in urls.ts applies to page
// markup. Registered in astro.config.mjs. Plain .mjs with no imports so the
// Astro config can load it without a TypeScript loader.
const SELF_HOST = 'piedmontmakers.org';

function isExternal(href) {
  const match = /^https?:\/\/([^/?#]+)/i.exec(href);
  return match !== null && match[1].toLowerCase() !== SELF_HOST;
}

export default function rehypeExternalLinks() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && isExternal(href)) {
          node.properties.target = '_blank';
          // hast stores rel as a token array; tolerate a string from raw HTML.
          const existing = node.properties.rel;
          const rel = Array.isArray(existing) ? [...existing] : String(existing ?? '').split(/\s+/).filter(Boolean);
          if (!rel.includes('noopener')) rel.push('noopener');
          node.properties.rel = rel;
        }
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
