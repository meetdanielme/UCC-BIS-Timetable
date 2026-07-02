# Year 2 Schedule Design

## Goal

Create two accurate, useful views of the BSc Business Information Systems Year 2 timetable for 2026-27:

- `schedule.md`: a durable text reference.
- `schedule.html`: a portable, self-contained interactive planner that works offline.

The timetable PDFs are the authority for teaching events. `academic_calendar_2026-27.txt` is the authority for academic milestones and no-teaching periods.

## User choices

- Tutorial groups: Group A and Group B, selected with an in-page switch.
- Interaction level: full planner.
- Packaging: one self-contained HTML deliverable.
- Accepted visual direction: hybrid planner (Option C).
- Overlapping events must remain visible.
- Continue through implementation without additional approval gates.

## Source interpretation

Each PDF page represents one teaching week. Event time comes from its horizontal position in the PDF grid, not text extraction order. Week ranges printed inside events define recurrence.

Group A and Group B events are retained. The selected group shows its explicitly labelled tutorials plus every event without a group label, including repeated IS2206 tutorial slots because the source does not identify a narrower allocation.

The PDFs contain a real overlap in Semester 1, Week 6: `IS2208/T gA` and the one-week `IS2217/L` both occupy Monday 13:00-14:00. The HTML must display both.

## Markdown structure

`schedule.md` contains:

1. Source and interpretation notes.
2. A concise academic-year overview.
3. Semester 1 and Semester 2 weekly timetables for Groups A and B.
4. Week-specific exceptions.
5. Academic milestones, recesses, study periods, and examinations.
6. A room-code note stating that room identifiers are preserved exactly as supplied.

Tables use one event per row so overlapping or adjacent events are not hidden inside wide timetable cells.

## HTML experience

### App shell

The page uses the bright interpretation of the UCC system requested after the initial build:

- Deep navy `#003c69` for the navigation band.
- Gold `#ffb500` for active states and primary cues.
- The official UCC header logo replaces the earlier text-only mark and is embedded for offline use.
- White surfaces and a light gray `#f6f8fa` application canvas.
- Support blue `#0b4d84`, light borders, navy text, and strong module colours.
- Merriweather-style serif headings and Fira GO-style sans-serif interface copy, with robust local fallbacks.
- Flat surfaces, restrained 4-8px radii, subtle borders, and no decorative gradients.

The accepted concept is stored at `design/year-2-schedule-concept.png`. It is a visual guide only; event content must come from the supplied files.

### Main layout

Desktop uses three bright functional areas:

1. A compact module-filter rail.
2. The main Monday-Friday schedule.
3. A context rail with the next event, nearest academic milestone, and weekly load.

Small screens collapse to one column: controls, context summary, then a chronological agenda. The full weekly grid is never squeezed below readable width.

### Controls

- Semester 1 / Semester 2 tabs.
- Previous and next teaching-week buttons.
- Week/date picker.
- Group A / Group B switch; the selected group persists locally.
- “Today” button that resolves the current date to the relevant teaching week or nearest academic milestone.
- Elective-only module filters with show-all and hide-all actions; core modules always remain visible.
- Independent Lecture and Tutorial toggles apply across the whole schedule.
- Saved filter selections preserve both elective modules and session types for each semester.
- Saved elective selections are stored separately for each semester.
- A collapsible module key exposes full names without crowding timetable blocks.
- Print button.

State is reflected in the URL hash so a selected semester and week can be bookmarked without requiring a server.

### Event display

Each event shows:

- Module code.
- Lecture or tutorial.
- Group A or Group B where applicable.
- Start and end time.
- Room.
- Source week range or exception.

On the desktop timeline, overlapping events divide the available day width into equal lanes. The lane algorithm assigns the lowest available lane and calculates the total lane count for each overlap cluster.

On narrow screens and in print, overlaps become adjacent chronological rows with a visible “Overlaps” label linking the simultaneous items.

### Academic calendar integration

Milestones appear in the context rail and a dedicated “Academic year” panel. No-teaching public holidays, recesses, study periods, and exam periods are visually distinct from teaching weeks.

The panel is presented as “Academic events”: four dates relevant to the selected teaching week remain visible, while the complete source calendar is available through a disclosure control. This keeps the default view concise without removing any dates.

If a public holiday falls inside a timetable week, events remain available for source transparency but are marked cancelled by the academic calendar and excluded from weekly contact-hour totals.

### Accessibility and resilience

- Semantic landmarks, buttons, headings, and lists.
- Full keyboard operation and visible focus states.
- Sufficient color contrast; color is never the only indicator.
- `aria-live` announcement when week or filters change.
- Reduced-motion support.
- A visible fallback message if schedule data cannot be loaded.
- No network dependency, tracking, or external service.

## Testing

Automated tests cover:

- Group A/B isolation while preserving shared sessions.
- Exact Group B tutorial times and rooms from both timetable PDFs.
- Week-range and exception matching.
- Current-week/date resolution.
- Public-holiday cancellation.
- Weekly contact-hour totals.
- Overlap lane assignment, including Week 6 Monday at 13:00.
- URL state parsing.
- Static validation that `schedule.html` is self-contained.

Browser verification covers desktop and mobile layouts, controls, filtering, week navigation, overlap rendering, printing, focus visibility, and absence of overflow.

## Scope boundaries

The deliverable does not invent module names, lecturer names, room maps, assignments, or personal events because those details are not present in the supplied sources. It does not connect to UCC systems or require installation.
