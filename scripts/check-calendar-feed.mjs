import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const feedPath = new URL("../dist/calendar.ics", import.meta.url);

const ics = await readFile(feedPath, "utf8");

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

console.log("calendar.ics feed contract looks good");
