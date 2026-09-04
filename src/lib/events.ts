/** Stable public identity, independent of dates and collection ordering. */
export const eventAnchor = (id: string) => `event-${id}`;

export const eventIsCurrent = (start: string, end: string | undefined, today: string) =>
  (end || start) >= today;

export const eventIsUpcoming = (start: string, end: string | undefined, today: string, horizon: string) =>
  eventIsCurrent(start, end, today) && start <= horizon;

/** Events take place in California, regardless of the visitor's timezone. */
export const pacificDate = (now: Date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);

export const upcomingHorizon = (today: string) => {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 30);
  return date.toISOString().slice(0, 10);
};
