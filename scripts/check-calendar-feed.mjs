import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const feedPath = new URL("../dist/calendar.ics", import.meta.url);
const calendarPagePath = new URL("../dist/calendar/index.html", import.meta.url);

const ics = await readFile(feedPath, "utf8");
const calendarPage = await readFile(calendarPagePath, "utf8");

assert.match(ics, /^BEGIN:VCALENDAR\r?\n/);
assert.match(ics, /\r?\nVERSION:2\.0\r?\n/);
assert.match(ics, /\r?\nPRODID:-\/\/Piedmont Makers\/\/Calendar\/\/EN\r?\n/);
assert.match(ics, /\r?\nMETHOD:PUBLISH\r?\n/);
assert.match(ics, /\r?\nX-WR-CALNAME:Piedmont Makers calendar\r?\n/);
assert.match(ics, /\r?\nBEGIN:VEVENT\r?\n/);
assert.match(ics, /\r?\nUID:2026-07-04-fourth-of-july-parade@piedmontmakers\.org\r?\n/);
assert.match(ics, /\r?\nSUMMARY:4th of July Parade entry\r?\n/);
assert.match(
  ics,
  /\r?\nURL:https:\/\/(piedmontmakers\.org|piedmontmakers\.github\.io\/piedmontmakers\.org)\/calendar#2026-07-04\r?\n/
);
assert.match(ics, /\r?\nDTSTART;TZID=America\/Los_Angeles:20260704T100000\r?\n/);
assert.match(ics, /\r?\nEND:VCALENDAR\r?\n?$/);

assert.match(
  calendarPage,
  /href="https:\/\/calendar\.google\.com\/calendar\/r\?cid=webcal%3A%2F%2F[^"]+calendar\.ics"/
);
assert.match(calendarPage, />Google Calendar</);
assert.match(calendarPage, /href="webcal:\/\/[^"]+calendar\.ics"[^>]*>Apple Calendar</);
assert.doesNotMatch(calendarPage, /calendar\/render\?cid=https%3A/);

console.log("calendar.ics feed contract looks good");
