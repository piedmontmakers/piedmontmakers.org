import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const TIMEZONE = "America/Los_Angeles";

const actionLabel: Record<string, string> = {
  tickets: "Get tickets",
  register: "Register",
  volunteer: "Volunteer",
  exhibit: "Exhibit",
  info: "More info",
};

const formatDate = (date: Date) =>
  `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(
    date.getUTCDate()
  ).padStart(2, "0")}`;

const formatTimestamp = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

const addDays = (date: Date, days: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const foldLine = (line: string) => {
  if (line.length <= 75) return line;

  const chunks = [line.slice(0, 75)];
  let rest = line.slice(75);

  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }

  return chunks.join("\r\n");
};

const parseTime = (time: string | undefined) => {
  if (!time) return null;

  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!match) return null;

  const period = match[3].toLowerCase();
  const rawHour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  if (rawHour < 1 || rawHour > 12 || minute < 0 || minute > 59) return null;

  const hour = period === "pm" ? (rawHour % 12) + 12 : rawHour % 12;
  return { hour, minute };
};

const formatLocalDateTime = (date: Date, time: { hour: number; minute: number }) =>
  `${formatDate(date)}T${String(time.hour).padStart(2, "0")}${String(time.minute).padStart(
    2,
    "0"
  )}00`;

const resolveUrl = (baseUrl: string, url: string) => {
  if (url.startsWith("//")) return `https:${url}`;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  return `${baseUrl}/${url}`;
};

export async function GET(context: APIContext) {
  const baseUrl = (
    (context.site?.toString() ?? "https://piedmontmakers.org/") +
    import.meta.env.BASE_URL.replace(/^\//, "")
  ).replace(/\/$/, "");

  const events = (await getCollection("events")).sort(
    (a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf()
  );

  const anchorSeen = new Map<string, number>();
  const anchorFor = (iso: string) => {
    const n = (anchorSeen.get(iso) ?? 0) + 1;
    anchorSeen.set(iso, n);
    return n === 1 ? iso : `${iso}-${n}`;
  };

  const dtstamp = formatTimestamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Piedmont Makers//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Piedmont Makers calendar",
    "X-WR-CALDESC:Public events from Piedmont Makers",
    `X-WR-TIMEZONE:${TIMEZONE}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ];

  for (const event of events) {
    const startIso = event.data.startDate.toISOString().slice(0, 10);
    const eventUrl = `${baseUrl}/calendar#${anchorFor(startIso)}`;
    const startTime = parseTime(event.data.startTime);
    const endTime = parseTime(event.data.endTime);

    const descriptionParts = [
      event.data.summary,
      ...(event.data.actions ?? []).map(
        (action) =>
          `${action.label || actionLabel[action.type]}: ${resolveUrl(baseUrl, action.url)}`
      ),
    ].filter(Boolean);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@piedmontmakers.org`,
      `DTSTAMP:${dtstamp}`,
      `SUMMARY:${escapeText(event.data.title)}`
    );

    if (startTime) {
      lines.push(
        `DTSTART;TZID=${TIMEZONE}:${formatLocalDateTime(event.data.startDate, startTime)}`
      );
      if (endTime) {
        lines.push(
          `DTEND;TZID=${TIMEZONE}:${formatLocalDateTime(
            event.data.endDate ?? event.data.startDate,
            endTime
          )}`
        );
      }
    } else {
      const endDate = addDays(event.data.endDate ?? event.data.startDate, 1);
      lines.push(`DTSTART;VALUE=DATE:${formatDate(event.data.startDate)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDate(endDate)}`);
    }

    if (event.data.location) lines.push(`LOCATION:${escapeText(event.data.location)}`);
    if (descriptionParts.length > 0) {
      lines.push(`DESCRIPTION:${escapeText(descriptionParts.join("\n"))}`);
    }
    lines.push(`URL:${eventUrl}`, "END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.map(foldLine).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="piedmont-makers-calendar.ics"',
    },
  });
}
