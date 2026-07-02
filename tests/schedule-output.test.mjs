import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const outputUrl = new URL("../schedule.html", import.meta.url);

test("built planner is self-contained and exposes core controls", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /Year 2 Schedule/);
  assert.match(html, /data-action="previous-week"/);
  assert.match(html, /data-action="next-week"/);
  assert.match(html, /data-action="today"/);
  assert.match(html, /data-action="print"/);
  assert.match(html, /data-action="save-filters"/);
  assert.match(html, /data-action="toggle-filters"/);
  assert.match(html, /data-group="A"/);
  assert.match(html, /data-group="B"/);
  assert.match(html, /year2-schedule-electives-v2/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+href=["']https?:/);
});

test("built planner contains the accepted design tokens and accessibility rules", async () => {
  const html = await readFile(outputUrl, "utf8");

  for (const token of [
    "#ffb500",
    "#003c69",
    "#0b4d84",
    "#121212",
    "#d2d8df",
    "#5b6f81",
  ]) {
    assert.match(html, new RegExp(token));
  }
  assert.match(html, /@media \(max-width: 760px\)/);
  assert.match(html, /:focus-visible/);
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /aria-live="polite"/);
});

test("built planner uses the accepted bright concept theme", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /data-theme="bright"/);
  assert.match(html, /--canvas: #f6f8fa/);
  assert.match(html, /\.schedule-region\s*\{[^}]*background: var\(--surface\)/s);
  assert.match(html, /\.timeline\s*\{[^}]*background: var\(--surface\)/s);
});

test("built planner embeds source data and no module imports", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /s1-is2217-l-mon/);
  assert.match(html, /2027-04-30/);
  assert.doesNotMatch(html, /\bimport\s+\{/);
  assert.doesNotMatch(html, /\bexport\s+(const|function)/);
});

test("filters apply only to electives and expose full module names", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /data-filter="elective"/);
  assert.match(html, /Core modules are always shown/);
  assert.match(html, /<summary>Module names<\/summary>/);
  assert.match(html, /data-filter="kind"/);
  assert.match(html, />Session type</);
});

test("group switch labels the selected timetable throughout the planner", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /Choose tutorial group/);
  assert.match(html, /normalizeSavedGroup/);
  assert.match(html, /s1-is2208-t-tue-b/);
  assert.match(html, /s2-is2207-t-mon-b/);
});

test("header uses the embedded official UCC logo and academic events are progressively disclosed", async () => {
  const html = await readFile(outputUrl, "utf8");

  assert.match(html, /class="brand-logo"/);
  assert.match(html, /src="data:image\/svg\+xml;base64,/);
  assert.doesNotMatch(html, /class="brand-logo"[^>]+image\/png/);
  assert.match(html, /<h2 id="calendar-title">Academic events<\/h2>/);
  assert.match(html, /id="upcoming-milestones"/);
  assert.match(html, /View full academic calendar/);
  assert.match(html, /<details class="academic-events-more"/);
});
