# Year 2 Schedule Fidelity Ledger

| Area | Reference evidence | Render evidence | Result |
|---|---|---|---|
| Information architecture | Accepted hybrid planner: filters, weekly schedule, and context rail | Desktop render uses the same three-region structure; mobile reorders context, filters, and agenda | Matched |
| Palette | Accepted bright concept: navy `#003c69`, gold `#ffb500`, white panels, light gray canvas, coloured events | Exact structural colours are present in navigation, controls, canvas, grid, and event blocks | Matched |
| Typography | Serif academic headings plus sans-serif interface text | Georgia/Merriweather fallbacks for headings and Fira GO/Fira Sans/Arial for UI | Matched without external font loading |
| Brand | Official UCC identity in the navy header | Official UCC logo is embedded in the standalone HTML and replaces the text-only mark | Matched |
| Event anatomy | Week grid with time axis, room, module, type, and visible overlap treatment | Event blocks show code, time, and room; overlap lanes are equal width with a compact `2x` cue | Matched and corrected after the first render |
| Responsive behavior | Hybrid concept should become a readable mobile agenda | At 390x844 the timeline is replaced by a chronological agenda, four Week 7 overlap labels remain visible, and page width equals scroll width | Matched |
| Controls | Semester, week navigation, Group A/B switch, elective filters, session-type toggles, print | The group switch persists locally; core modules remain visible; Notion-classified electives and the Lecture/Tutorial selection can be filtered and saved by semester | Matched |
| Source accuracy | PDFs, academic calendar, and Notion Modules database | Both tutorial groups included; PDF times, room codes, and weeks retained; Notion module names/elective types included; public-holiday cancellations and TBC milestones included | Matched |
| Academic events | Complete source calendar without overwhelming the timetable | Four relevant dates are visible by default; all dated and TBC events remain available behind one disclosure | Matched |

## Material fixes made

- Kept all six desktop week controls on one toolbar row.
- Replaced the long overlap badge with a compact `2x` marker so side-by-side events remain readable.
- Added the four TBC milestones to the rendered academic-year panel.
- Added a self-contained favicon to remove the only browser console error.

## Intentional deviations

- The generated structural concept contained invented UCC navigation, metrics, and event content. None of that was copied; only its broad planner structure informed the build.
- The later bright-theme request replaces the initial dark canvas while retaining the supplied UCC navy and gold identity.
- No remote font or icon package is loaded because the deliverable must work as one offline HTML file.
