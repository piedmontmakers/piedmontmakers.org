// Shared event-time helpers used by the .ics feed and the calendar page's
// structured data. Event times are free-form strings like "11:00 AM"; dates
// parse from YAML as midnight UTC (use getUTC* accessors).

export interface ParsedTime {
  hour: number;
  minute: number;
}

export const parseTime = (time: string | undefined): ParsedTime | null => {
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

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD from a YAML-parsed date (midnight UTC). */
export const isoDate = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

/**
 * ISO 8601 local date-time without a UTC offset (schema.org accepts this;
 * consumers read it as the venue's local time, matching the .ics feed's
 * TZID=America/Los_Angeles approach without hardcoding a DST offset).
 */
export const isoLocalDateTime = (date: Date, time: ParsedTime) =>
  `${isoDate(date)}T${pad(time.hour)}:${pad(time.minute)}:00`;
