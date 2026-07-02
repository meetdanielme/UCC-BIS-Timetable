const moduleColors = [
  "#005eb8",
  "#1f7a4f",
  "#6a3d9a",
  "#c65d00",
  "#007b83",
  "#b3261e",
  "#8a4b32",
  "#526577",
];

const icons = {
  cancelled: "Cancelled",
  overlap: "Overlaps",
};

const filterStorageKey = "year2-schedule-electives-v2";

function readFilterPreferences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(filterStorageKey) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeFilterPreferences(preferences) {
  try {
    localStorage.setItem(filterStorageKey, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}

const todayIso = new Date().toISOString().slice(0, 10);
const hashState = parseHashState(window.location.hash);
const filterPreferences = readFilterPreferences();
const initialWeek =
  teachingWeeks.find(({ number, semester }) => number === hashState.week && semester === hashState.semester) ??
  getWeekForDate(todayIso, teachingWeeks) ??
  teachingWeeks.find(({ semester }) => semester === hashState.semester) ??
  teachingWeeks[0];

const state = {
  semester: initialWeek.semester,
  week: initialWeek.number,
  group: normalizeSavedGroup(filterPreferences),
  modules: new Set(),
  kinds: new Set(["Lecture", "Tutorial"]),
  filtersCollapsed: Boolean(filterPreferences.collapsed),
};

const elements = {
  appLayout: document.querySelector(".app-layout"),
  semesterTabs: [...document.querySelectorAll("[data-semester]")],
  groupButtons: [...document.querySelectorAll("[data-group]")],
  topbarMeta: document.querySelector("#topbar-meta"),
  weekSelect: document.querySelector("#week-select"),
  weekTitle: document.querySelector("#week-title"),
  weekDates: document.querySelector("#week-dates"),
  calendarNotice: document.querySelector("#calendar-notice"),
  moduleFilters: document.querySelector("#module-filters"),
  typeFilters: document.querySelector("#type-filters"),
  moduleKeyList: document.querySelector("#module-key-list"),
  filterSaveStatus: document.querySelector("#filter-save-status"),
  filterToggle: document.querySelector('[data-action="toggle-filters"]'),
  timeline: document.querySelector("#timeline"),
  agenda: document.querySelector("#agenda"),
  weeklyHours: document.querySelector("#weekly-hours"),
  loadValue: document.querySelector("#load-value"),
  nextEvent: document.querySelector("#next-event"),
  nearestMilestone: document.querySelector("#nearest-milestone"),
  milestoneList: document.querySelector("#milestone-list"),
  upcomingMilestones: document.querySelector("#upcoming-milestones"),
  announcer: document.querySelector("#announcer"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function moduleColor(module) {
  const modules = [...new Set(events.map((event) => event.module))].sort();
  return moduleColors[modules.indexOf(module) % moduleColors.length];
}

function currentWeek() {
  return teachingWeeks.find(({ number, semester }) => number === state.week && semester === state.semester);
}

function semesterWeeks() {
  return teachingWeeks.filter(({ semester }) => semester === state.semester);
}

function semesterModules() {
  return [...new Set(events.filter(({ semester }) => semester === state.semester).map(({ module }) => module))].sort();
}

function semesterElectives() {
  return semesterModules().filter((module) => moduleCatalog[module]?.elective);
}

function moduleInfo(module) {
  return moduleCatalog[module] ?? { name: module, elective: false };
}

function resetModuleFilters() {
  state.modules = new Set(semesterElectives());
}

function loadSavedFilters() {
  const saved = filterPreferences.semesters?.[String(state.semester)];
  const normalized = normalizeSavedElectives(saved, semesterElectives());
  state.modules = new Set(normalized);
  state.kinds = new Set(normalizeSavedKinds(saved));
  elements.filterSaveStatus.textContent = "";
}

function markFiltersChanged() {
  elements.filterSaveStatus.textContent = "Unsaved changes";
}

function renderFilterPanelState() {
  elements.appLayout.classList.toggle("filters-collapsed", state.filtersCollapsed);
  elements.filterToggle.setAttribute("aria-expanded", String(!state.filtersCollapsed));
  elements.filterToggle.setAttribute(
    "aria-label",
    state.filtersCollapsed ? "Expand filters" : "Collapse filters",
  );
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function weekEvents({ filtered = true } = {}) {
  const all = filterEventsForGroup(
    eventsForWeek(events, currentWeek(), academicCalendar),
    state.group,
  );
  if (!filtered) return all;
  return all.filter(
    (event) =>
      state.kinds.has(event.kind) &&
      (!moduleInfo(event.module).elective || state.modules.has(event.module)),
  );
}

function eventOverlapIds(dayEvents) {
  const overlapIds = new Set();
  for (const event of dayEvents) {
    for (const other of dayEvents) {
      if (
        event.id !== other.id &&
        toMinutes(event.start) < toMinutes(other.end) &&
        toMinutes(other.start) < toMinutes(event.end)
      ) {
        overlapIds.add(event.id);
      }
    }
  }
  return overlapIds;
}

function renderSemesterTabs() {
  for (const tab of elements.semesterTabs) {
    const selected = Number(tab.dataset.semester) === state.semester;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
}

function renderGroupControls() {
  for (const button of elements.groupButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.group === state.group));
  }
  elements.topbarMeta.textContent = `Academic year 2026-27 · Group ${state.group}`;
}

function renderWeekControls() {
  const week = currentWeek();
  elements.weekTitle.textContent = `Week ${week.number}`;
  elements.weekDates.textContent = formatDateRange(week.start, week.end);
  elements.weekSelect.innerHTML = semesterWeeks()
    .map(
      (option) =>
        `<option value="${option.number}" ${option.number === week.number ? "selected" : ""}>Week ${option.number} · ${escapeHtml(formatDateRange(option.start, option.end))}</option>`,
    )
    .join("");

  const index = semesterWeeks().findIndex(({ number }) => number === week.number);
  document.querySelector('[data-action="previous-week"]').disabled = index === 0;
  document.querySelector('[data-action="next-week"]').disabled = index === semesterWeeks().length - 1;

  const interruptions = academicCalendar.filter((item) => {
    const start = item.date;
    const end = item.end ?? item.date;
    return end >= week.start && start <= week.end && ["public-holiday", "recess"].includes(item.type);
  });
  elements.calendarNotice.classList.toggle("is-visible", interruptions.length > 0);
  elements.calendarNotice.textContent = interruptions.map(({ label }) => label).join(" · ");
}

function renderFilters() {
  elements.moduleFilters.innerHTML = semesterElectives()
    .map(
      (module) => {
        const info = moduleInfo(module);
        return `
        <label class="filter-item" title="${escapeHtml(info.name)}">
          <input type="checkbox" value="${module}" data-filter="elective" ${state.modules.has(module) ? "checked" : ""}>
          <span class="module-dot" style="--module-color:${moduleColor(module)}"></span>
          <span class="filter-copy">
            <strong>${module}</strong>
            <small>${escapeHtml(info.name)}</small>
          </span>
        </label>`;
      },
    )
    .join("");

  elements.moduleKeyList.innerHTML = semesterModules()
    .map(
      (module) => {
        const info = moduleInfo(module);
        return `
          <div>
            <dt>${module}${info.elective ? " · Elective" : ""}</dt>
            <dd>${escapeHtml(info.name)}</dd>
          </div>`;
      },
    )
    .join("");

  elements.typeFilters.innerHTML = ["Lecture", "Tutorial"]
    .map(
      (kind) => `
        <label class="filter-item">
          <input type="checkbox" value="${kind}" data-filter="kind" ${state.kinds.has(kind) ? "checked" : ""}>
          <span class="module-dot" style="--module-color:${kind === "Lecture" ? "#005eb8" : "#ffb500"}"></span>
          <span class="filter-copy"><strong>${kind}</strong></span>
        </label>`,
    )
    .join("");
  renderFilterPanelState();
}

function eventMarkup(event, overlap) {
  const info = moduleInfo(event.module);
  const totalMinutes = 11 * 60;
  const topPercent = ((toMinutes(event.start) - 8 * 60) / totalMinutes) * 100;
  const heightPercent = ((toMinutes(event.end) - toMinutes(event.start)) / totalMinutes) * 100;
  const gap = 3;
  const width = `calc(${100 / event.laneCount}% - ${gap}px)`;
  const left = `calc(${(event.lane / event.laneCount) * 100}% + ${event.lane * gap}px)`;
  const label = `${event.module}, ${info.name}, ${event.kind}${event.group ? ` Group ${event.group}` : ""}, ${event.start} to ${event.end}, ${event.room}${event.cancelled ? ", cancelled" : ""}`;

  return `
    <article
      class="event ${event.kind.toLowerCase()} ${event.cancelled ? "cancelled" : ""}"
      style="top:calc(${topPercent}% + 2px);height:calc(${heightPercent}% - 4px);left:${left};width:${width};--module-color:${moduleColor(event.module)}"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >
      ${overlap ? '<span class="event-badge" aria-label="Overlaps another event">2×</span>' : ""}
      <strong>${event.module}${event.group ? ` · ${event.group}` : ""}</strong>
      <span class="event-time">${event.start}-${event.end}</span>
      <span class="event-room">${event.room}</span>
    </article>`;
}

function renderTimeline() {
  const week = currentWeek();
  const visible = weekEvents();
  const headers = dayNames
    .slice(1)
    .map((day, index) => {
      const date = new Date(`${week.start}T12:00:00`);
      date.setDate(date.getDate() + index);
      return `<div class="day-header">${day}<span>${formatShortDate(date.toISOString().slice(0, 10))}</span></div>`;
    })
    .join("");

  const labels = Array.from({ length: 12 }, (_, index) => {
    const top = (index / 11) * 100;
    return `<span class="time-label" style="top:${top}%">${String(index + 8).padStart(2, "0")}:00</span>`;
  }).join("");

  const columns = dayNames
    .slice(1)
    .map((_, index) => {
      const dayEvents = visible.filter(({ day }) => day === index + 1);
      const assigned = assignOverlapLanes(dayEvents);
      const overlapIds = eventOverlapIds(dayEvents);
      return `<div class="day-column">${assigned.map((event) => eventMarkup(event, overlapIds.has(event.id))).join("")}</div>`;
    })
    .join("");

  elements.timeline.innerHTML = `<div class="timeline-corner"></div>${headers}<div class="time-axis">${labels}</div>${columns}`;
}

function renderAgenda() {
  const visible = weekEvents();
  elements.agenda.innerHTML = dayNames
    .slice(1)
    .map((dayName, index) => {
      const dayEvents = visible.filter(({ day }) => day === index + 1);
      if (!dayEvents.length) return "";
      const overlapIds = eventOverlapIds(dayEvents);
      return `
        <section class="agenda-day">
          <h3>${dayName}</h3>
          <div class="agenda-events">
            ${dayEvents
              .map(
                (event) => {
                  const info = moduleInfo(event.module);
                  return `
                  <article class="agenda-event ${event.cancelled ? "cancelled" : ""}" style="--module-color:${moduleColor(event.module)}">
                    <time>${event.start}<br>${event.end}</time>
                    <div>
                      ${overlapIds.has(event.id) ? `<span class="overlap-note">${icons.overlap}</span>` : ""}
                      <strong>${event.module} · ${event.kind}${event.group ? ` ${event.group}` : ""}</strong>
                      <p class="agenda-module-name">${escapeHtml(info.name)}</p>
                      <p>${event.room}${event.cancelled ? ` · ${icons.cancelled}` : ""}</p>
                    </div>
                  </article>`;
                },
              )
              .join("")}
          </div>
        </section>`;
    })
    .join("");

  if (!elements.agenda.innerHTML) {
    elements.agenda.innerHTML = '<div class="empty-state">No events match the selected filters.</div>';
  }
}

function renderContext() {
  const visible = weekEvents();
  const hours = weeklyHours(visible);
  elements.weeklyHours.textContent = `${hours} contact hour${hours === 1 ? "" : "s"}`;
  elements.loadValue.textContent = String(hours);

  const next = visible.find(({ cancelled }) => !cancelled);
  elements.nextEvent.innerHTML = next
    ? `<p><strong>${next.module} · ${next.kind}${next.group ? ` ${next.group}` : ""}</strong><br>${escapeHtml(moduleInfo(next.module).name)}<br>${dayNames[next.day]} · ${next.start}-${next.end}<br>${next.room}</p>`
    : "<p>No active events in this view.</p>";

  const milestone = nearestMilestone(currentWeek().start, academicCalendar);
  elements.nearestMilestone.innerHTML = `<strong>${escapeHtml(milestone.label)}</strong><br>${formatLongDate(milestone.date)}`;

  const selectedElectives = state.modules.size;
  const electiveTotal = semesterElectives().length;
  const selectedTypes = [...state.kinds].join(" + ") || "No session types";
  document.querySelector("#schedule-description").textContent =
    `Group ${state.group} · ${visible.length} sessions · ${selectedElectives}/${electiveTotal} electives · ${selectedTypes}`;
}

function renderMilestones() {
  const upcoming = academicCalendar.filter(({ date }) => date >= currentWeek().start);
  const featured = (upcoming.length ? upcoming : academicCalendar.slice(-4)).slice(0, 4);
  const accentByType = {
    term: "#005eb8",
    "public-holiday": "#c65d00",
    study: "#6a3d9a",
    exam: "#b3261e",
    recess: "#1f7a4f",
  };
  elements.upcomingMilestones.innerHTML = featured
    .map((item) => {
      const date = new Date(`${item.date}T12:00:00`);
      const day = new Intl.DateTimeFormat("en-IE", { day: "numeric" }).format(date);
      const month = new Intl.DateTimeFormat("en-IE", { month: "short" }).format(date);
      return `
        <article class="academic-event" style="--event-accent:${accentByType[item.type] ?? "var(--blue)"}">
          <time datetime="${item.date}"><strong>${day}</strong>${month}</time>
          <div class="academic-event-copy">
            <strong>${escapeHtml(item.label)}</strong>
            <small>${item.end ? `${formatShortDate(item.date)}-${formatShortDate(item.end)}` : formatLongDate(item.date)}</small>
          </div>
        </article>`;
    })
    .join("");

  const dated = academicCalendar
    .map(
      (item) => `
        <article class="academic-event-compact">
          <time datetime="${item.date}">${formatShortDate(item.date)}${item.end ? `-${formatShortDate(item.end)}` : ""}</time>
          <span>${escapeHtml(item.label)}</span>
        </article>`,
    )
    .join("");
  const undated = undatedMilestones
    .map(
      (label) => `
        <article class="academic-event-compact">
          <time>TBC</time>
          <span>${escapeHtml(label)}</span>
        </article>`,
    )
    .join("");
  elements.milestoneList.innerHTML = dated + undated;
}

function syncHash() {
  const nextHash = `semester=${state.semester}&week=${state.week}`;
  if (window.location.hash.slice(1) !== nextHash) history.replaceState(null, "", `#${nextHash}`);
}

function announce() {
  const week = currentWeek();
  elements.announcer.textContent = `Showing Group ${state.group}, Semester ${week.semester}, Week ${week.number}, ${weekEvents().length} sessions.`;
}

function render() {
  renderSemesterTabs();
  renderGroupControls();
  renderWeekControls();
  renderFilters();
  renderTimeline();
  renderAgenda();
  renderContext();
  renderMilestones();
  syncHash();
  announce();
}

function moveWeek(direction) {
  const weeks = semesterWeeks();
  const index = weeks.findIndex(({ number }) => number === state.week);
  const next = weeks[index + direction];
  if (!next) return;
  state.week = next.number;
  render();
}

document.addEventListener("click", (event) => {
  const groupButton = event.target.closest("[data-group]");
  if (groupButton) {
    state.group = groupButton.dataset.group;
    filterPreferences.group = state.group;
    writeFilterPreferences(filterPreferences);
    render();
    return;
  }

  const semesterTab = event.target.closest("[data-semester]");
  if (semesterTab) {
    state.semester = Number(semesterTab.dataset.semester);
    state.week = semesterWeeks()[0].number;
    loadSavedFilters();
    render();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "previous-week") moveWeek(-1);
  if (action === "next-week") moveWeek(1);
  if (action === "today") {
    const week = getWeekForDate(todayIso, teachingWeeks);
    const target = week ?? teachingWeeks.find(({ start }) => start >= todayIso) ?? teachingWeeks.at(-1);
    state.semester = target.semester;
    state.week = target.number;
    loadSavedFilters();
    render();
  }
  if (action === "print") window.print();
  if (action === "clear-filters") {
    state.modules.clear();
    markFiltersChanged();
    render();
  }
  if (action === "select-all") {
    resetModuleFilters();
    markFiltersChanged();
    render();
  }
  if (action === "save-filters") {
    filterPreferences.semesters ??= {};
    filterPreferences.semesters[String(state.semester)] = {
      electives: [...state.modules],
      kinds: [...state.kinds],
    };
    filterPreferences.collapsed = state.filtersCollapsed;
    elements.filterSaveStatus.textContent = writeFilterPreferences(filterPreferences)
      ? "Saved"
      : "Could not save";
  }
  if (action === "toggle-filters") {
    state.filtersCollapsed = !state.filtersCollapsed;
    filterPreferences.collapsed = state.filtersCollapsed;
    writeFilterPreferences(filterPreferences);
    renderFilterPanelState();
  }
});

document.addEventListener("change", (event) => {
  if (event.target === elements.weekSelect) {
    state.week = Number(event.target.value);
    render();
    return;
  }
  if (event.target.matches('[data-filter="elective"]')) {
    event.target.checked ? state.modules.add(event.target.value) : state.modules.delete(event.target.value);
    markFiltersChanged();
    render();
  }
  if (event.target.matches('[data-filter="kind"]')) {
    event.target.checked ? state.kinds.add(event.target.value) : state.kinds.delete(event.target.value);
    markFiltersChanged();
    render();
  }
});

window.addEventListener("hashchange", () => {
  const next = parseHashState(window.location.hash);
  const week = teachingWeeks.find(({ semester, number }) => semester === next.semester && number === next.week);
  if (!week) return;
  state.semester = week.semester;
  state.week = week.number;
  loadSavedFilters();
  render();
});

loadSavedFilters();
render();
