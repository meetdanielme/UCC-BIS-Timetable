import test from "node:test";
import assert from "node:assert/strict";

import {
  academicCalendar,
  events,
  moduleCatalog,
  teachingWeeks,
} from "../src/schedule-data.mjs";
import {
  assignOverlapLanes,
  eventsForWeek,
  filterEventsForGroup,
  getWeekForDate,
  normalizeSavedElectives,
  normalizeSavedGroup,
  normalizeSavedKinds,
  parseHashState,
  weeklyHours,
} from "../src/schedule-core.mjs";

test("source data includes the Week 6 Monday overlap and both tutorial groups", () => {
  const monday = events.filter(
    (event) =>
      event.weeks.includes(6) &&
      event.day === 1 &&
      event.start === "13:00" &&
      event.end === "14:00",
  );

  assert.deepEqual(
    monday.map(({ module }) => module).sort(),
    ["IS2208", "IS2217"],
  );
  assert.deepEqual(
    events
      .filter((event) => event.group === "B")
      .map(({ id, day, start, end }) => [id, day, start, end]),
    [
      ["s1-is2208-t-tue-b", 2, "15:00", "16:00"],
      ["s1-is2208-t-wed-b", 3, "09:00", "10:00"],
      ["s2-is2207-t-mon-b", 1, "10:00", "11:00"],
      ["s2-is2209-t-tue-b", 2, "15:00", "16:00"],
      ["s2-is2209-t-wed-b", 3, "09:00", "10:00"],
      ["s2-is2207-t-wed-b", 3, "12:00", "13:00"],
    ],
  );
  assert.equal(teachingWeeks.length, 24);
});

test("group filtering keeps shared sessions and only the selected tutorials", () => {
  const week = teachingWeeks.find(({ number }) => number === 7);
  const visible = eventsForWeek(events, week, academicCalendar);
  const groupA = filterEventsForGroup(visible, "A");
  const groupB = filterEventsForGroup(visible, "B");

  assert.equal(groupA.some(({ group }) => group === "B"), false);
  assert.equal(groupB.some(({ group }) => group === "A"), false);
  assert.ok(groupA.some(({ id }) => id === "s1-is2208-t-mon-a"));
  assert.ok(groupB.some(({ id }) => id === "s1-is2208-t-wed-b"));
  assert.ok(groupA.some(({ id }) => id === "s1-is2204-l-mon"));
  assert.ok(groupB.some(({ id }) => id === "s1-is2204-l-mon"));
});

test("resolves dates to teaching weeks and returns null during study periods", () => {
  assert.equal(getWeekForDate("2026-09-09", teachingWeeks)?.number, 6);
  assert.equal(getWeekForDate("2027-04-08", teachingWeeks)?.number, 36);
  assert.equal(getWeekForDate("2026-12-02", teachingWeeks), null);
});

test("public-holiday events are cancelled and excluded from contact hours", () => {
  const week = teachingWeeks.find(({ number }) => number === 13);
  const visible = filterEventsForGroup(
    eventsForWeek(events, week, academicCalendar),
    "A",
  );
  const cancelled = visible.filter((event) => event.cancelled);

  assert.ok(cancelled.length > 0);
  assert.ok(cancelled.every((event) => event.date === "2026-10-26"));
  assert.equal(
    weeklyHours(visible),
    visible
      .filter((event) => !event.cancelled)
      .reduce((sum, event) => sum + event.durationHours, 0),
  );
});

test("assigns separate lanes to simultaneous events", () => {
  const overlap = assignOverlapLanes([
    { id: "a", start: "13:00", end: "14:00" },
    { id: "b", start: "13:00", end: "14:00" },
  ]);

  assert.deepEqual(
    overlap.map(({ lane, laneCount }) => [lane, laneCount]),
    [
      [0, 2],
      [1, 2],
    ],
  );
});

test("does not treat adjacent events as overlapping", () => {
  const adjacent = assignOverlapLanes([
    { id: "a", start: "13:00", end: "14:00" },
    { id: "b", start: "14:00", end: "15:00" },
  ]);

  assert.deepEqual(
    adjacent.map(({ lane, laneCount }) => [lane, laneCount]),
    [
      [0, 1],
      [0, 1],
    ],
  );
});

test("parses valid URL state and falls back for invalid values", () => {
  assert.deepEqual(parseHashState("#semester=2&week=36"), {
    semester: 2,
    week: 36,
  });
  assert.deepEqual(parseHashState("#semester=9&week=nope"), {
    semester: 1,
    week: null,
  });
});

test("Week 7 preserves all recurring overlaps and source contact hours", () => {
  const week = teachingWeeks.find(({ number }) => number === 7);
  const visible = filterEventsForGroup(
    eventsForWeek(events, week, academicCalendar),
    "A",
  );
  const wednesday = assignOverlapLanes(visible.filter(({ day }) => day === 3));
  const thursday = assignOverlapLanes(visible.filter(({ day }) => day === 4));

  assert.equal(visible.length, 22);
  assert.equal(weeklyHours(visible), 27);
  assert.equal(wednesday.filter(({ laneCount }) => laneCount === 2).length, 2);
  assert.equal(thursday.filter(({ laneCount }) => laneCount === 2).length, 2);
});

test("week-specific exceptions match the supplied PDFs", () => {
  const week14 = teachingWeeks.find(({ number }) => number === 14);
  const week36 = teachingWeeks.find(({ number }) => number === 36);
  const week14Events = filterEventsForGroup(
    eventsForWeek(events, week14, academicCalendar),
    "A",
  );
  const week36Events = filterEventsForGroup(
    eventsForWeek(events, week36, academicCalendar),
    "A",
  );

  assert.equal(
    week14Events.some(({ id }) => id === "s1-ec2204-l-tue"),
    false,
  );
  assert.equal(week36Events.length, 15);
  assert.equal(
    week36Events.some(({ id }) => id === "s2-is2217-l-mon"),
    false,
  );
});

test("saved elective filters keep valid choices and discard stale values", () => {
  assert.deepEqual(
    normalizeSavedElectives(
      { electives: ["MG2001", "OLD1000"] },
      ["MG2001", "MG2008"],
    ),
    ["MG2001"],
  );
});

test("invalid saved elective filters fall back to all electives", () => {
  assert.deepEqual(
    normalizeSavedElectives(null, ["MG2001", "MG2008"]),
    ["MG2001", "MG2008"],
  );
});

test("saved session types keep valid choices and default to both types", () => {
  assert.deepEqual(normalizeSavedKinds({ kinds: ["Tutorial", "Seminar"] }), ["Tutorial"]);
  assert.deepEqual(normalizeSavedKinds(null), ["Lecture", "Tutorial"]);
});

test("saved tutorial group accepts A or B and defaults to A", () => {
  assert.equal(normalizeSavedGroup({ group: "B" }), "B");
  assert.equal(normalizeSavedGroup({ group: "C" }), "A");
  assert.equal(normalizeSavedGroup(null), "A");
});

test("module catalogue marks only the Notion Year 2 electives", () => {
  assert.deepEqual(
    Object.entries(moduleCatalog)
      .filter(([, module]) => module.elective)
      .map(([code]) => code)
      .sort(),
    ["AC2206", "FE1200", "MG2001", "MG2003", "MG2007", "MG2008", "MG3021"],
  );
  assert.equal(moduleCatalog.IS2208.name, "Test Driven Development");
  assert.equal(moduleCatalog.FE1200.name, "Introduction to Sustainable Food Marketing Channels and Supply Chains");
  assert.deepEqual(
    [...new Set(events.map(({ module }) => module))]
      .filter((module) => !moduleCatalog[module]),
    [],
  );
});
