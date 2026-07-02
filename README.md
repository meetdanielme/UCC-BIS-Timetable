# UCC BIS Year 2 Timetable

An interactive Year 2 timetable for UCC's BSc Business Information Systems programme for the 2026-27 academic year.

The planner combines the supplied Semester 1 and Semester 2 timetable PDFs with the academic calendar. It supports:

- Semester and teaching-week navigation
- Group A and Group B tutorial switching
- Elective-module filters
- Lecture and tutorial toggles
- Saved filter and group preferences
- Overlapping event layouts
- Public-holiday cancellations and contact-hour totals
- Responsive desktop and mobile views
- A compact academic-events overview

## Open the timetable

Open [`schedule.html`](./schedule.html) directly in a browser. It is a self-contained file and does not require a web server.

Alternatively, run a local server:

```bash
python3 -m http.server 4173
```

Then visit <http://localhost:4173/schedule.html>.

## Rebuild

Node.js 18 or newer is required. The build downloads the official UCC vector logo and embeds it in the standalone HTML.

```bash
node scripts/build-schedule.mjs
```

## Test

```bash
node --test
```

## Project structure

- `schedule.html` - generated interactive timetable
- `schedule.md` - accessible Markdown reference
- `src/` - timetable data, UI logic, and HTML template
- `scripts/` - standalone HTML build script
- `tests/` - data and generated-output tests
- `Semester1.pdf` and `Semester2.pdf` - supplied timetable sources
- `academic_calendar_2026-27.txt` - supplied academic-calendar source
- `DESIGN.md` - visual-system reference

## Notes

Room codes and week ranges are retained as supplied. Dates and timetable details may change; consult official UCC systems for authoritative current information.

This is an independent student project and is not an official University College Cork service.
