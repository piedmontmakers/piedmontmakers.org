/** Resolve a site path once; preserve external URLs and same-page fragments. */
export function withBase(path: string, base: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const prefix = base.replace(/\/$/, '');
  const absolute = `/${path.replace(/^\/+/, '')}`;
  return prefix && (absolute === prefix || absolute.startsWith(`${prefix}/`)) ? absolute : `${prefix}${absolute}`;
}
export const link = (path: string) => withBase(path, import.meta.env.BASE_URL);
export const asset = link;

/**
 * True for http(s) URLs that leave piedmontmakers.org. Subdomains such as
 * donate.piedmontmakers.org count as external: they are separate sites.
 * Site rule: every external link opens in a new tab (docs/agent/site-reference.md).
 */
export function isExternal(href: string): boolean {
  const match = /^https?:\/\/([^/?#]+)/i.exec(href);
  return match !== null && match[1].toLowerCase() !== 'piedmontmakers.org';
}

/** Spread onto an `<a>` whose href may be external: `<a href={href} {...externalLinkAttrs(href)}>`. */
export function externalLinkAttrs(href: string | undefined): { target?: string; rel?: string } {
  return href && isExternal(href) ? { target: '_blank', rel: 'noopener' } : {};
}
