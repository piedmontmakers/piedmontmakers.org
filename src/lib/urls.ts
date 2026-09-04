/** Resolve a site path once; preserve external URLs and same-page fragments. */
export function withBase(path: string, base: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const prefix = base.replace(/\/$/, '');
  const absolute = `/${path.replace(/^\/+/, '')}`;
  return prefix && (absolute === prefix || absolute.startsWith(`${prefix}/`)) ? absolute : `${prefix}${absolute}`;
}
export const link = (path: string) => withBase(path, import.meta.env.BASE_URL);
export const asset = link;
