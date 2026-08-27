// Venue resolution shared by the calendar page, its schema.org Event data,
// and the .ics feed.
//
// Event frontmatter carries a human location ("Alan Harvey Theater, Piedmont
// High School"), which is what the website should show. Phones need something
// a geocoder can find, so the .ics feed pairs that prose with a street address
// from the table below. Add a venue here and every consumer picks it up.

/** Matched against the frontmatter location, first hit wins. Street address only. */
const venueStreet: [RegExp, string][] = [
  [/10th Street/i, "3100 East 10th Street, Oakland, CA"],
  [/Piedmont Middle School/i, "740 Magnolia Ave, Piedmont, CA 94611"],
  [/Alan Harvey Theater|Mary G\. Ross|Piedmont High School/i, "800 Magnolia Ave, Piedmont, CA 94611"],
  [/Piedmont Park/i, "711 Highland Ave, Piedmont, CA 94611"],
  [/Berean Christian/i, "245 El Divisadero Ave, Walnut Creek, CA 94598"],
  [/Acalanes/i, "1200 Pleasant Hill Rd, Lafayette, CA 94549"],
  [/Woodside High School/i, "199 Churchill Ave, Woodside, CA 94062"],
];

/** Zoom/Meet "locations" have nowhere to navigate to, so they get no address. */
export const isVirtualLocation = (loc: string) =>
  /zoom|google meet|virtual|online/i.test(loc);

/** Street address for a location, or undefined when the venue isn't in the table. */
export const streetAddressFor = (loc: string): string | undefined =>
  isVirtualLocation(loc) ? undefined : venueStreet.find(([re]) => re.test(loc))?.[1];

/**
 * Prose plus street address, for anything that has to be geocoded (.ics
 * LOCATION, Maps links). Keeps room-level detail a street address can't carry
 * ("Morrison Gym"), while giving the geocoder a real address to land on.
 * Falls back to the raw prose for virtual events and unlisted venues.
 */
export const geocodableLocation = (loc: string): string => {
  const street = streetAddressFor(loc);
  if (!street) return loc;
  // Drop a trailing city already named in the street address, so we don't
  // emit "10th Street practice field, Oakland, 3100 East 10th Street, Oakland, CA".
  const prose = loc.replace(/,\s*([A-Za-z .'-]+)\s*$/, (match, tail: string) =>
    street.toLowerCase().includes(tail.trim().toLowerCase()) ? "" : match
  );
  return `${prose}, ${street}`;
};

export const mapsUrl = (loc: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(geocodableLocation(loc))}`;
