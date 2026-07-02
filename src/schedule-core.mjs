export const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getWeekForDate(date, weeks) {
  const value = new Date(`${date}T12:00:00`);
  return (
    weeks.find(
      (week) =>
        value >= new Date(`${week.start}T00:00:00`) &&
        value <= new Date(`${week.end}T23:59:59`),
    ) ?? null
  );
}

function addDays(date, amount) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + amount);
  return value.toISOString().slice(0, 10);
}

export function eventsForWeek(allEvents, week, calendar) {
  if (!week) return [];

  const publicHolidays = new Set(
    calendar
      .filter(({ type }) => type === "public-holiday")
      .map(({ date }) => date),
  );

  return allEvents
    .filter(
      (event) =>
        event.semester === week.semester && event.weeks.includes(week.number),
    )
    .map((event) => {
      const date = addDays(week.start, event.day - 1);
      const durationHours =
        (toMinutes(event.end) - toMinutes(event.start)) / 60;
      return {
        ...event,
        date,
        durationHours,
        cancelled: publicHolidays.has(date),
      };
    })
    .sort(
      (a, b) =>
        a.day - b.day ||
        toMinutes(a.start) - toMinutes(b.start) ||
        toMinutes(a.end) - toMinutes(b.end) ||
        a.module.localeCompare(b.module),
    );
}

export function weeklyHours(weekEvents) {
  return weekEvents
    .filter(({ cancelled }) => !cancelled)
    .reduce((total, { durationHours }) => total + durationHours, 0);
}

export function filterEventsForGroup(weekEvents, group) {
  const selectedGroup = group === "B" ? "B" : "A";
  return weekEvents.filter((event) => !event.group || event.group === selectedGroup);
}

export function assignOverlapLanes(events) {
  const sorted = [...events].sort(
    (a, b) =>
      toMinutes(a.start) - toMinutes(b.start) ||
      toMinutes(a.end) - toMinutes(b.end) ||
      a.id.localeCompare(b.id),
  );
  const output = [];
  let cluster = [];
  let clusterEnd = -1;

  const finishCluster = () => {
    if (!cluster.length) return;
    const laneEnds = [];
    const assigned = cluster.map((event) => {
      const start = toMinutes(event.start);
      let lane = laneEnds.findIndex((end) => end <= start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = toMinutes(event.end);
      return { ...event, lane };
    });
    const laneCount = laneEnds.length;
    output.push(...assigned.map((event) => ({ ...event, laneCount })));
    cluster = [];
    clusterEnd = -1;
  };

  for (const event of sorted) {
    const start = toMinutes(event.start);
    if (cluster.length && start >= clusterEnd) finishCluster();
    cluster.push(event);
    clusterEnd = Math.max(clusterEnd, toMinutes(event.end));
  }
  finishCluster();

  return output;
}

export function parseHashState(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const semesterValue = Number(params.get("semester"));
  const weekValue = Number(params.get("week"));
  return {
    semester: semesterValue === 2 ? 2 : 1,
    week: Number.isInteger(weekValue) && weekValue > 0 ? weekValue : null,
  };
}

export function normalizeSavedElectives(saved, availableElectives) {
  if (!saved || !Array.isArray(saved.electives)) {
    return [...availableElectives];
  }
  return saved.electives.filter((module) => availableElectives.includes(module));
}

export function normalizeSavedKinds(saved) {
  const validKinds = ["Lecture", "Tutorial"];
  if (!saved || !Array.isArray(saved.kinds)) {
    return validKinds;
  }
  return saved.kinds.filter((kind) => validKinds.includes(kind));
}

export function normalizeSavedGroup(saved) {
  return saved?.group === "B" ? "B" : "A";
}

export function formatDateRange(start, end, locale = "en-IE") {
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  const startText = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    ...(sameMonth ? {} : { month: "short" }),
  }).format(startDate);
  const endText = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(endDate);
  return `${startText}-${endText}`;
}

export function nearestMilestone(date, calendar) {
  const now = new Date(`${date}T12:00:00`);
  return (
    calendar.find(
      (item) => new Date(`${item.date}T12:00:00`).getTime() >= now.getTime(),
    ) ?? calendar.at(-1)
  );
}
