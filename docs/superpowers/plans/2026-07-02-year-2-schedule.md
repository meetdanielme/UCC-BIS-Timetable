# Year 2 Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an accurate Markdown schedule and a self-contained interactive HTML planner from the supplied timetable PDFs and academic calendar.

**Architecture:** Keep normalized source data and pure scheduling functions in small ES modules, render them through a dependency-free HTML template, then mechanically build a portable `schedule.html` with data and logic inlined. Tests use Node's built-in test runner, so the project needs no package installation.

**Tech Stack:** Markdown, semantic HTML, CSS, vanilla JavaScript ES modules, Node.js built-in test runner, Playwright or the in-app browser for end-to-end verification.

---

## File structure

- `schedule.md`: human-readable academic-year reference.
- `schedule.html`: generated self-contained planner.
- `src/schedule-data.mjs`: normalized teaching weeks, events, and academic milestones.
- `src/schedule-core.mjs`: pure date, filtering, totals, and overlap functions.
- `src/schedule-ui.mjs`: DOM rendering and event handlers.
- `src/schedule.template.html`: semantic shell and UCC Digital Dark styles.
- `scripts/build-schedule.mjs`: inlines source modules into `schedule.html`.
- `tests/schedule-core.test.mjs`: behavioral unit tests.
- `tests/schedule-output.test.mjs`: self-contained output checks.

### Task 1: Normalize source data

**Files:**
- Create: `src/schedule-data.mjs`
- Create: `schedule.md`
- Test: `tests/schedule-core.test.mjs`

- [ ] **Step 1: Write a failing source-integrity test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { events, teachingWeeks } from "../src/schedule-data.mjs";

test("source data includes the Week 6 Monday overlap and excludes Group B", () => {
  const monday = events.filter((event) =>
    event.weeks.includes(6) && event.day === 1 &&
    event.start === "13:00" && event.end === "14:00"
  );
  assert.deepEqual(monday.map(({ module }) => module).sort(), ["IS2208", "IS2217"]);
  assert.equal(events.some((event) => event.group === "B"), false);
  assert.equal(teachingWeeks.length, 24);
});
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `node --test tests/schedule-core.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Add normalized data**

Use this event shape consistently:

```js
{
  id: "s1-is2208-t-mon-a",
  semester: 1,
  module: "IS2208",
  kind: "Tutorial",
  group: "A",
  day: 1,
  start: "13:00",
  end: "14:00",
  room: "ORB_BIS",
  weeks: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
}
```

Record all PDF events using their grid coordinates and retain the source spelling of room codes. Record the 24 teaching weeks (Semester 1 Weeks 6-17, Semester 2 Weeks 24-33 and 36-37) and every dated calendar milestone.

- [ ] **Step 4: Write `schedule.md` from the normalized source**

Include Group A tables, repeated ungrouped tutorial slots, week-specific exceptions, and every academic-calendar date. Explicitly list the Week 6 overlap.

- [ ] **Step 5: Run the source test**

Run: `node --test tests/schedule-core.test.mjs`
Expected: PASS.

### Task 2: Implement scheduling logic with TDD

**Files:**
- Create: `src/schedule-core.mjs`
- Modify: `tests/schedule-core.test.mjs`

- [ ] **Step 1: Add failing tests for date resolution, filtering, totals, and overlaps**

```js
import {
  assignOverlapLanes,
  eventsForWeek,
  getWeekForDate,
  weeklyHours
} from "../src/schedule-core.mjs";

test("resolves a date to its teaching week", () => {
  assert.equal(getWeekForDate("2026-09-09", teachingWeeks)?.number, 6);
  assert.equal(getWeekForDate("2026-12-02", teachingWeeks), null);
});

test("marks a public-holiday event cancelled and excludes it from hours", () => {
  const week = teachingWeeks.find(({ number }) => number === 13);
  const visible = eventsForWeek(events, week, academicCalendar);
  assert.equal(visible.filter(({ cancelled }) => cancelled).length > 0, true);
  assert.equal(
    weeklyHours(visible),
    visible.filter(({ cancelled }) => !cancelled)
      .reduce((sum, event) => sum + event.durationHours, 0)
  );
});

test("assigns separate lanes to simultaneous Week 6 events", () => {
  const overlap = assignOverlapLanes([
    { id: "a", start: "13:00", end: "14:00" },
    { id: "b", start: "13:00", end: "14:00" }
  ]);
  assert.deepEqual(overlap.map(({ lane, laneCount }) => [lane, laneCount]), [[0, 2], [1, 2]]);
});
```

- [ ] **Step 2: Run tests and confirm missing exports**

Run: `node --test tests/schedule-core.test.mjs`
Expected: FAIL because `schedule-core.mjs` does not exist.

- [ ] **Step 3: Implement pure functions**

Implement:

```js
export function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getWeekForDate(date, weeks) {
  const value = new Date(`${date}T12:00:00`);
  return weeks.find((week) =>
    value >= new Date(`${week.start}T00:00:00`) &&
    value <= new Date(`${week.end}T23:59:59`)
  ) ?? null;
}
```

Add `eventsForWeek`, `weeklyHours`, `parseHashState`, and an interval-partitioning `assignOverlapLanes` implementation. Treat end times as exclusive so adjacent events do not overlap.

- [ ] **Step 4: Run all logic tests**

Run: `node --test tests/schedule-core.test.mjs`
Expected: PASS.

### Task 3: Build the semantic app shell

**Files:**
- Create: `src/schedule.template.html`
- Create: `src/schedule-ui.mjs`
- Create: `scripts/build-schedule.mjs`
- Create: `tests/schedule-output.test.mjs`

- [ ] **Step 1: Write a failing output test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("built planner is self-contained and exposes core controls", async () => {
  const html = await readFile(new URL("../schedule.html", import.meta.url), "utf8");
  assert.match(html, /Year 2 Schedule/);
  assert.match(html, /data-action="previous-week"/);
  assert.match(html, /data-action="print"/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+href=/);
});
```

- [ ] **Step 2: Run and confirm `schedule.html` is missing**

Run: `node --test tests/schedule-output.test.mjs`
Expected: FAIL with `ENOENT`.

- [ ] **Step 3: Implement template, renderer, and builder**

The template must contain `<!-- DATA -->`, `<!-- CORE -->`, and `<!-- UI -->` markers. The build script reads the three source modules, strips `export` keywords and module imports where necessary, inserts them into one `<script>`, and writes `schedule.html`.

The UI renderer must:

- render semester tabs and teaching-week navigation;
- draw a Monday-Friday timeline on wide screens;
- render chronological day sections below 760px;
- calculate event position from minutes since 08:00;
- use `lane` and `laneCount` for overlap width;
- filter by module and event kind;
- update the context rail and URL hash;
- call `window.print()` from the print control.

- [ ] **Step 4: Build and test output**

Run: `node scripts/build-schedule.mjs && node --test tests/schedule-output.test.mjs`
Expected: PASS.

### Task 4: Apply the accepted visual system

**Files:**
- Modify: `src/schedule.template.html`
- Rebuild: `schedule.html`

- [ ] **Step 1: Add static assertions for design tokens and responsiveness**

Assert the template contains the exact tokens `#ffb500`, `#003c69`, `#0b4d84`, `#121212`, `#374151`, `#d1d5db`, a `@media (max-width: 760px)` rule, `:focus-visible`, and `prefers-reduced-motion`.

- [ ] **Step 2: Run and observe the assertions fail**

Run: `node --test tests/schedule-output.test.mjs`
Expected: FAIL on the first missing design token or accessibility selector.

- [ ] **Step 3: Implement the accepted hybrid planner styling**

Match `DESIGN.md` and `design/year-2-schedule-concept.png`: navy navigation band, serif hierarchy, gold active cues, near-black schedule canvas, open desktop layout, restrained radii, flat surfaces, and a context rail. Do not copy invented events or milestones from the generated concept.

- [ ] **Step 4: Rebuild and rerun tests**

Run: `node scripts/build-schedule.mjs && node --test`
Expected: all tests PASS with no warnings.

### Task 5: Browser verification and correction

**Files:**
- Modify as needed: `src/schedule.template.html`, `src/schedule-ui.mjs`
- Rebuild: `schedule.html`

- [ ] **Step 1: Serve the folder**

Run: `python3 -m http.server 4173`
Expected: planner available at `http://localhost:4173/schedule.html`.

- [ ] **Step 2: Verify desktop workflow**

At 1440x1000, verify Semester 1 Week 6 loads, both Monday 13:00 events render side by side, semester tabs and week buttons work, module/type filters update events and hours, the nearest milestone updates, and print invokes the browser print flow.

- [ ] **Step 3: Verify mobile workflow**

At 390x844, verify a chronological agenda replaces the compressed grid, simultaneous events carry an “Overlaps” label, controls remain keyboard reachable, and there is no horizontal page overflow.

- [ ] **Step 4: Compare visual references**

Inspect `design/year-2-schedule-concept.png` and the latest desktop screenshot with `view_image`. Compare copy, layout, typography, palette, event anatomy, spacing, and overlap treatment. Fix any material mismatch while preserving source accuracy.

- [ ] **Step 5: Run final verification**

Run: `node scripts/build-schedule.mjs && node --test`
Expected: all tests PASS.
